# util-angular介绍

[![Member project of .NET Core Community](https://img.shields.io/badge/member%20project%20of-NCC-9e20c9.svg)](https://github.com/dotnetcore)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://mit-license.org/)

<a href="https://www.jetbrains.com/?from=Util" target="_blank">
    <img src="https://github.com/dotnetcore/Home/blob/master/img/jetbrains.svg" title="JetBrains" />
</a>

## UI 技术选型

- ### Js语言
  - #### [TypeScript](https://www.typescriptlang.org/zh/)
    TypeScript 是 微软开发的脚本语言, 扩展了弱类型的 Javascript,提供增强的语法和强类型支持.
    
    为编辑器代码提示和语法错误检测奠定坚实基础.

- ### Js框架
  - #### [Angular](https://angular.io)

    Angular 是 Google开发的 Js框架.

    Angular使用 TypeScript 脚本语言开发, 并采用 [RxJs](https://github.com/ReactiveX/RxJS) 响应式编程框架.

    Angular 是前端Js三大框架之一,另外两个是 Vue 和 React.    

    Util UI 用于开发管理后台,选择 Angular 是因为它的语法最优雅, 也最符合后端开发人员的习惯.

- ### Angular 组件库

  - #### [Ng Zorro](https://ng.ant.design/)

    Ng Zorro 是阿里 Ant Design 的 Angular 版本,提供 80+ 常用组件,覆盖大部分业务开发场景.

  - #### [Ng Alain](https://ng-alain.com/)

    虽然 Ng Zorro 提供了大量常用组件,但项目开发需要一个集成度更高的环境.
    
    Ng Alain 是一个基架项目, 集成了 Ng Zorro 组件,提供业务开发的项目模板,除了菜单导航等框架元素,还有很多开箱即用的业务处理页面模板.

- ### Angular 微前端框架

  - #### [Angular Module Federation](https://github.com/angular-architects/module-federation-plugin)

    如果你的项目包含大量 Angular 模块,所有文件在同一个项目中,会导致开发环境卡顿和缓慢.

    发布项目也可能需要很长时间.

    另外,如果某个模块需要进行修改,哪怕只修改一行代码,也需要对所有模块重新发布.

    与后端的微服务类似,微前端是前端的项目拆分方法.

    微前端将不同的 Angular 模块拆分到不同项目中,可以独立开发,独立测试和独立部署.

    > 无论你是否使用微服务架构,均可使用微前端拆分方式.

    Angular Module Federation 是基于Webpack模块联合的Angular微前端解决方案.


## Util Angular UI 特点

- ### 使用 Visual Studio 开发工具

  前端开发一般使用 Visual Studio Code , 不过 Util Angular UI主要使用 Razor 页面,使用 Visual Studio 更方便.

- ### 组件扩展支持

  除了支持 Ng Zorro 原生功能外,Util UI还对常用组件进行了扩展.

  最重要的扩展是支持常用组件直接发出 Api 请求,而不用定义额外的服务.

- ### Razor TagHelper 支持
  
  Util Angular UI不仅可以使用 html 页面,还能使用 .Net Razor 页面.

  Razor 页面可以使用 TagHelper 服务端标签. 

  Util 已将大部分 Ng Zorro 组件封装为 TagHelper 标签.

  除了获得强类型提示外,TagHelper 作为抽象层,提供更简洁的标签语法.

  另一个强大之处在于Lambda表达式支持, 可以将DTO直接绑定到 TagHelper 标签上.

  能够从Lambda表达式提取元数据,并自动设置大量常用属性,比如name,验证,模型绑定等.

- ### 前后分离

  一些开发人员看到 Util Angular UI 使用 .Net Razor 页面,可能认为 UI 与 .Net 高度耦合,但现在的趋势是前后分离.

  所谓前后分离,是前端UI和后端API没有依赖,更换某一端对另一端没有影响.

  另外,前后分离后,前端UI和后端API可以由不同的开发人员完成.

  .Net Razor页面仅在开发阶段提供帮助,在发布时, Razor 页面会转换为 html ,后续发布流程与纯前端开发方式相同.

  一旦发布成功,将完全脱离.Net 环境,可以使用 Nginx 容器承载它.

  发布后的产物,与你使用纯前端方式开发打包没有区别.

  如果你喜欢,可以把后端API换成JAVA,也能正常运行.  

- ### 配套Api支持

  前端UI和后端API的开发是两个完全不同的领域.

  但开发一个功能,又需要前端和后端的配合,他们需要沟通,作出一些约定.

  对于配合不到位的团队,前后端的沟通成本可能很高,另外提供的API可能无法满足UI的需求,从而让前端代码变得畸形.

  通常.Net开发人员的Js编程功底高于常规前端人员,前端人员更擅长样式布局.

  Util Angular UI 不仅提供对前端组件的封装,同时也为常见功能提供 Api 支持. 

  对于使用 Util Angular UI 的团队, 将 UI 和 API 交给同一个.Net开发人员就是最好的选择.

  前端人员仅调整界面样式即可.

  不仅减少了沟通成本, API和前端组件的高度集成封装,让常规功能的开发效率得到大幅提升.

  当然,这对 .Net 开发人员的水平有一定要求.  

- ### 本地化支持

  得益于 Ng Alain 本地化的良好设计, 可以使用 i18n 管道进行文本的本地化转换.

  ```
  '文本' | i18n
  ```

  不过对于需要支持本地化的项目,这依然是一个负担,每个表单项,每个表格项,每个文本,可能都需要添加 i18n 管道.

  Util Angular UI 让本地化开发更进一步,对大部分组件提供了本地化支持,只有极少数文本需要手工添加 i18n 管道.

- ### 授权访问支持

  Ng Alain提供了授权访问的支持.

  Util Platform权限模块基于资源和角色的设计,可以很好的与 Ng Alain授权进行集成.

  你可以控制菜单和任意区域根据权限显示和隐藏.

- ### 微前端支持

  Util Angular UI 引入了 [Angular Module Federation](https://github.com/angular-architects/module-federation-plugin) , 能够将 Angular 模块拆分到不同项目中,可以独立开发,独立测试和独立部署.

  对于大中型项目,这是非常有必要的.


## Util Angular UI 功能列表

Util Angular UI 主要由 util-angular 和 Util.Ui.NgZorro 两个库提供支持.

  - ### util-angular 功能列表

    [util-angular](https://github.com/util-core/util-angular) 是一个 Js 库, 由Curd组件基类, Ng Zorro常用组件扩展指令和一组工具类组成.

    - #### 基础类型

      - ViewModel - 视图模型基类
      - TreeViewModel - 树形视图模型基类
      - TreeNode - 树形节点基类
      - PageList - 分页列表
      - QueryParameter - 查询参数基类
      - TreeQueryParameter - 树形查询参数基类
      - Result - 服务端返回结果
      - StateCode - 服务端状态码约定
      - SelectItem - 列表项
      - SelectList - 列表
      - SelectOptionGroup - 列表配置组
      - SelectOption - 列表配置项

    - #### 工具类

      - 浏览器本地存储操作
      - Cookie操作
      - 事件总线操作
      - 本地化操作
      - Ioc操作
      - 加载操作
      - 路由操作
      - 弹出层操作
      - 抽屉操作
      - 表单操作
      - Http操作
      - Web Api操作
      - 消息操作
      - ...

    - #### Crud组件基类

      - 编辑组件基类
      - 表格编辑组件基类
      - 树形编辑组件基类
      - 查询组件基类
      - 表格查询组件基类
      - 树形表格查询组件基类

    - #### Ng Zorro指令扩展

      - 必填项验证扩展指令
      - 验证消息扩展指令
      - Ng Zorro 按钮扩展指令
      - Ng Zorro 选择框扩展指令
      - Ng Zorro 表格扩展指令
      - Ng Zorro 表格编辑扩展指令
      - Ng Zorro 树形表格扩展指令
      - Ng Zorro 树形扩展指令
      - Ng Zorro 上传扩展指令

  - ### Util.Ui.NgZorro 库介绍
      
    Util.Ui.NgZorro 是一个 C# 类库,包含 TagHelper标签和树形控制器等类型.
    
    绝大部分 Ng Zorro 组件已经封装.
    
    由于组件很多,就不一一列出.

## Util Angular UI 已知缺陷

Util Angular UI 在提供大量支持的同时,也存在一些缺陷.

  - ### 开发阶段运行比较缓慢

    与 Visual Studio Code 相比,使用 Visual Studio 开发 Angular 项目要慢一些,如果使用了 Resharper 插件,则会更慢.

    除开发工具影响外, Util Angular UI 在开发阶段需要启用 Angular JIT( 即时编译 ), 运行会变慢.

    另外, Util Angular UI 在开发阶段需要访问 Razor 页面,每当项目启动,Angular 主模块加载的所有组件都会发出 Razor 页面请求.

    不过运行缓慢仅存在于开发阶段,一旦发布,则与纯前端开发方式的运行速度相同.

  - ### 无法使用 Angular 常规延迟加载方式

    你不能使用 loadChildren 延迟加载模块,这是因为开发阶段组件的 templateUrl 指向 Razor 页面地址, 必须使用 Angular JIT 模式,等待运行时再获取组件模板.

    这个问题从 Angular 13 开始出现, Angular 13弃用了传统的视图引擎, 使用 loadChildren 加载指向 Razor 页面地址的组件会报异常.

    解决它的方法是使用微前端方案延迟加载模块, 当然你也可以回退到 Angular 13之前的版本.

    在同一个 Util Angular UI 项目中,你必须把所有的子模块加载到主模块中,并配置微前端将子模块发布为可独立加载包.

## Util Angular UI 适合你吗?

Util Angular UI 是为 .Net 全栈工程师准备的,如果你更喜欢使用 Visual Studio 开发,喜欢代码提示,喜欢更简洁的语法,希望开发的成本更低,它就适合你.