import {
    Inject,
    Injectable,
    InjectionToken,
    ModuleWithProviders,
    NgModule,
    OnDestroy,
    Optional,
    Provider,
    SkipSelf,
} from "@angular/core";
import * as _ from "lodash";

import { AuthService } from "./auth.service";
import { LoggingService } from "./logging.service";
import { WINDOW_SERVICE } from "./window.service";

export const STORAGE_TYPE_SETTING = new InjectionToken("StorageTypeSetting");

export const STORAGE_SCOPE_SETTING = new InjectionToken("StorageScopeSetting");

export const CLIENT_FEATURES = new InjectionToken("ClientStorageFeatures");

@NgModule({})
export class ClientStorageModule {
    /**
     * Prevents the module from being imported multiple times.
     * @param parentModule
     */
    constructor(@Optional() @SkipSelf() parentModule: ClientStorageModule) {
        if (parentModule) {
            throw new Error(
                "ClientStorageModule is already loaded. Import it in the AppModule only");
        }
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ClientStorageModule,
            providers: [ClientStore, ClientStorageManager]
        };
    }

    static forFeature(feature: string, type: StorageType, scope: StorageScope):
        ModuleWithProviders {
        return {
            ngModule: ClientStorageFeatureModule,
            providers: [
                {
                    multi: true,
                    provide: CLIENT_FEATURES,
                    useValue: feature
                },
                {
                    multi: true,
                    provide: STORAGE_TYPE_SETTING,
                    useValue: type
                },
                {
                    multi: true,
                    provide: STORAGE_SCOPE_SETTING,
                    useValue: scope
                },
            ]
        };
    }
}

@Injectable()
export class ClientStorageManager {
    private readonly featureToClientStorageServiceMap = new Map<string, IClientStorage>();

    addFeatures(features: { feature: string, service: IClientStorage }[]): void {
        features.forEach(config => {
            this.featureToClientStorageServiceMap.set(config.feature, config.service);
        });
    }

    removeFeatures(features: string[]): void {
        features.forEach(feature => this.featureToClientStorageServiceMap.delete(feature));
    }

    find(feature: string): IClientStorage {
        const service = this.featureToClientStorageServiceMap.get(feature);

        if (!service) {
            throw new Error(`No ClientStorage registered for feature "${feature}"`);
        }

        return service;
    }

    clients(): IterableIterator<IClientStorage> {
        return this.featureToClientStorageServiceMap.values();
    }
}

@NgModule({})
export class ClientStorageFeatureModule implements OnDestroy {
    constructor(
        @Inject(CLIENT_FEATURES) private readonly features: string[],
        private readonly clientStorageManager: ClientStorageManager,
        private readonly authService: AuthService,
        private readonly loggingService: LoggingService,
        @Inject(STORAGE_TYPE_SETTING) storageTypes: StorageType[],
        @Inject(STORAGE_SCOPE_SETTING) storageScopes: StorageScope[],
        @Inject(WINDOW_SERVICE) private readonly windowService: Window
    ) {
        const configs = _.zip(features, storageTypes, storageScopes);

        const feats = configs
            .map(([feature, storageType, storageScope]) => ({
                feature,
                service: this.createStorageClient(feature, storageType, storageScope)
            }));

        this.clientStorageManager.addFeatures(feats);
    }

    ngOnDestroy(): void {
        this.clientStorageManager.removeFeatures(this.features);
    }

    private clientStorageCreate(theWindow: Window, type: StorageType, logger: LoggingService) {
        return ClientStorage.create(theWindow, type, logger);
    }

    private clientScopeCreate(authService: AuthService, scope: StorageScope, feature: string) {
        return ClientScope.create(authService, scope, feature);
    }

    private createStorageClient(feature: string, type: StorageType, scope: StorageScope): IClientStorage {
        const clientScope = this.clientScopeCreate(this.authService, scope, feature);
        const clientStorage = this.clientStorageCreate(this.windowService, type, this.loggingService);
        return new ClientStorageService(clientStorage, clientScope);
    }
}

@Injectable()
export class ClientStore {
    constructor(private readonly manager: ClientStorageManager) {
    }

    forFeature(feature: string): IClientStorage {
        return this.manager.find(feature);
    }

    clients(): IterableIterator<IClientStorage> {
        return this.manager.clients();
    }
}

export class ClientStorage {
    static create(theWindow: Window, type: StorageType, logger: LoggingService) {
        let localStorage: Storage;
        let sessionStorage: Storage;
        try {
            localStorage = theWindow.localStorage;
        } catch {
            logger.logError("could not instantiate local storage", false);
        }
        try {
            sessionStorage = theWindow.sessionStorage;
        } catch {
            logger.logError("could not instantiate session storage", false);
        }
        switch (type) {
            case StorageType.Local:
                return new ClientStorage(StorageType.Local, localStorage || new NullStorage(), logger);
            case StorageType.Session:
                // tslint:disable-next-line:max-line-length
                return new ClientStorage(StorageType.Session, sessionStorage || new NullStorage(), logger);
            default:
                throw new Error(`unsupported storage type '${type}'`);
        }
    }

    constructor(
        public type: StorageType,
        public instance: Storage,
        public loggingService: LoggingService) {
    }
}

export class NullStorage implements Storage {
    [index: number]: string;
    [key: string]: any;

    public readonly length = 0;

    clear(): void {
        return;
    }

    getItem(key: string): string {
        return null;
    }

    key(index: number): string {
        return null;
    }

    removeItem(key: string): void {
        return;
    }

    setItem(key: string, data: string): void {
        return;
    }
}

export class ClientScope {
    static create(authService: AuthService, scope: StorageScope, feature: string) {
        switch (scope) {
            case StorageScope.Tenant:
                return new TenantScopeService(authService, feature);
            case StorageScope.User:
                return new UserScopeService(authService, feature);
            default:
                throw new Error(`unsupported scoping type '${scope}'`);
        }
    }
}

export interface IScopingService {
    feature: string;
    scope: StorageScope;
    canScope(): boolean;
    safeOwnsKey(key: string): boolean;
    scopeKey(key: string): string;
    removeKeyScope(key: string): string;
}

export class InvalidScopeState extends Error {
}

export abstract class ScopeBase implements IScopingService {
    constructor(
        public scope: StorageScope,
        protected authService: AuthService,
        public feature: string) {
    }

    abstract getScopeData(): string;
    abstract canScope(): boolean;

    safeOwnsKey(key: string): boolean {
        try {
            const prefix = this.getScopePrefix();
            return !!key && key.startsWith(prefix);
        } catch (InvalidScopeState) {
            return false;
        }
    }

    scopeKey(key: string): string {
        const scopeNorm = this.getScopePrefix();
        return `${scopeNorm}:${key}`;
    }

    removeKeyScope(key: string): string {
        const scopeNorm = this.getScopePrefix();
        return key.replace(new RegExp(`^${scopeNorm}\:`), "");
    }

    private getScopePrefix() {
        const scope = `${this.getScopeData()}:${this.feature}`;
        return scope.toLowerCase();
    }
}

export class UserScopeService extends ScopeBase {
    private get getUserDetails() {
        return this.authService.snapshot.userDetails;
    }

    constructor(authService: AuthService, feature: string) {
        super(StorageScope.User, authService, feature);
    }

    getScopeData() {
        if (!this.canScope()) {
            throw new InvalidScopeState();
        }

        return this.authService.snapshot.userDetails.subject;
    }

    canScope(): boolean {
        return this.getUserDetails && !!this.getUserDetails.subject;
    }
}

export class TenantScopeService extends ScopeBase {
    private get getUserDetails() {
        return this.authService.snapshot.userDetails;
    }

    constructor(authService: AuthService, feature: string) {
        super(StorageScope.Tenant, authService, feature);
    }

    getScopeData() {
        if (!this.canScope()) {
            throw new InvalidScopeState();
        }

        return this.authService.snapshot.userDetails.tenantId;
    }

    canScope(): boolean {
        return this.getUserDetails && !!this.getUserDetails.tenantId;
    }
}

export class AnonymousScopeService extends ScopeBase {
    constructor(feature: string) {
        // we use a bogus auth service, getScopeData has no use for what it offers
        super(StorageScope.None, null, feature);
    }

    getScopeData() {
        return "ANON_USER";
    }

    canScope(): boolean {
        return true;
    }
}

export class ClientStorageService implements IClientStorage {
    private anonymousClient: ClientStorageService;

    public get scopingService(): IScopingService {
        return this.scope.canScope() ?
            this.scope :
            this.anonymousClient ?
                this.anonymousClient.scopingService :
                this.scope;
    }

    public get storageType() {
        return this.storage.type;
    }

    constructor(
        private storage: ClientStorage,
        private scope: IScopingService) {
        // we back all scoped storage with an anonymous backed version, this allows callers to
        // decide if they want to fallback to anonymous scoped data in the event logged-in data is
        // not present
        if (!(scope instanceof AnonymousScopeService)) {
            this.anonymousClient = new ClientStorageService(storage, new AnonymousScopeService(scope.feature));
        }
    }

    clear(): void {
        this.getAll().forEach(item => this.storage.instance.removeItem(item.scopedKey));
    }

    /**
     * This method makes assumptions about the returned value, do not use this in production, only
     * use for debugging purposes.
     *
     * @returns
     * @memberof ClientStorageService
     */
    getAll() {
        const keys = Object.keys(this.storage.instance);
        const ownedKeys = keys.filter(key => this.scopingService.safeOwnsKey(key));
        return ownedKeys.map(key => ({
            key: this.scopingService.removeKeyScope(key),
            scopedKey: key,
            value: this.getItem(this.scopingService.removeKeyScope(key))
        }));
    }

    /**
     * This method attempts to get a defined value from the current store with the authorized scope.
     * If the caller passes fallbackToAnonScope the method will try the anonymous scope for this
     * storage.  if the item exists in the anonymous scope it will be transitioned to authorized scope
     * and deleted from anonymous scope.
     *
     * @template T
     * @param {string} key
     * @param {boolean} [fallbackToAnonScope=false]
     * @param {boolean} [forceAnonScope=false]
     * @returns {T}
     * @memberof ClientStorageService
     */
    getItem<T>(key: string, fallbackToAnonScope = false, forceAnonScope = false): T {
        const scopedKey = this.safeGetScopedKey(key);
        const value = this.storage.instance.getItem(scopedKey);

        if (forceAnonScope ||
            ((_.isNil(value)) && fallbackToAnonScope && this.anonymousClient)) {
            // we are going to use the backup anonymous client
            // currently we only support this for getItem, we fetch the value if there is one, we move
            // the anonymous value to be owned by this logged-in scope, and we delete the anonymous entry

            const obj: T = this.anonymousClient.getItem<T>(key);
            this.setItem(key, obj);
            this.anonymousClient.removeItem(key);

            return obj;
        }

        return JSON.parse(value) as T;
    }

    removeItem(key: string): void {
        const scopedKey = this.safeGetScopedKey(key);
        this.storage.instance.removeItem(scopedKey);
    }

    setItem(key: string, data: any): void {
        const scopedKey = this.safeGetScopedKey(key);
        this.storage.instance.setItem(scopedKey, JSON.stringify(data));
    }

    isSupported(): boolean {
        return !!this.storage;
    }

    private safeGetScopedKey(key: string) {
        try {
            return this.scopingService.scopeKey(key);
        } catch (InvalidScopeState) {
            return null;
        }
    }
}

export enum StorageType {
    Local = "Local",
    Session = "Session"
}

export enum StorageScope {
    /**
     * None is an internal scope you cannot configure this scope
     */
    None = "None",

    /**
     * Data is scoped to the user
     */
    User = "User",

    /**
     * Data is scoped to the tenant
     */
    Tenant = "Tenant"
}

export interface IClientStorage {
    scopingService: IScopingService;
    storageType: StorageType;
    clear(): void;
    getItem<T>(key: string, fallbackToAnonScope?: boolean): T | null;
    getAll(): { key: string, scopedKey: string, value: any | null }[];
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
}
