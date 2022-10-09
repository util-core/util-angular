import { ViewModel } from "util-angular";

/**
 * 应用程序参数
 */
export class ApplicationViewModel extends ViewModel {
    /**
     * 应用程序编码
     */
    code;
    /**
     * 应用程序名称
     */
    name;
    /**
    * 应用程序类型
    */
    type;
    /**
     * 启用
     */
    enabled;
    /**
     * 启用注册
     */
    registerEnabled;
    /**
     * 允许的授权类型
     */
    allowedGrantType;
    /**
     * 允许通过浏览器访问令牌
     */
    allowAccessTokensViaBrowser;
    /**
     * 允许的跨域来源
     */
    allowedCorsOrigins;
    /**
     * 需要同意
     */
    requireConsent;
    /**
     * 需要客户端密钥
     */
    requireClientSecret;
    /**
     * 客户端密钥列表
     */
    clientSecrets;
    /**
     * 认证重定向地址
     */
    redirectUri;
    /**
     * 注销重定向地址
     */
    postLogoutRedirectUri;
    /**
     * 允许的作用域
     */
    allowedScopes;
    /**
     * 访问令牌生命周期
     */
    accessTokenLifetime;
    /**
     * 备注
     */
    remark;
    /**
     * 创建时间
     */
    creationTime;
    /**
     * 创建人编号
     */
    creatorId;
    /**
     * 最后修改时间
     */
    lastModificationTime;
    /**
     * 最后修改人编号
     */
    lastModifierId;
    /**
     * 版本号
     */
    version;
}