# Refresh CDN cache plugin for @Serverless-Devs/s

[![Unit Test](https://github.com/DevDengChao/refresh-cdn-cache/actions/workflows/default.yml/badge.svg?branch=master&event=push)](https://github.com/DevDengChao/refresh-cdn-cache/actions/workflows/default.yml)

此插件可以帮你在 [Serverless-Devs](https://github.com/Serverless-Devs/Serverless-Devs) 运行过程中刷新 CDN 缓存.

+ 支持 v2 和 v3 版本的 s.yaml.
+ 支持刷新指定文件
+ 支持刷新指定目录
+ 支持刷新匹配表达式的全部路径
+ 支持同时刷新多个域名
+ 支持同时使用多个不同的访问凭据进行操作

## 如何使用

在 s.yaml 文件的 `post-deploy` 插槽中声明该插件即可:

### v3 示例

```yaml
# s3.yaml
resources:
  default:
    actions:
      post-deploy:
        - plugin: refresh-cdn-cache
          args:
            # cdn: aliyun 
            # access: cdn # 支持直接读取 s 中已配置的 access 作为访问凭据
            paths:
              # 刷新单个 URL
              - https://blog.dengchao.fun/index.html
        - plugin: refresh-cdn-cache
          args:
            # 支持重复加载插件以便使用不同的凭据进行操作
            accessKeyId: ${env(CDN_ACCESS_KEY_ID)}
            accessKeySecret: ${env(CDN_ACCESS_KEY_SECRET)}
            paths:
              # 刷新单个目录
              - https://blog.example.com/tag/
              # 使用 ^ 开头 $ 结尾的表达式进行匹配
              - ^https://blog.example.com/2022/.*$
    component: fc3
    props:
      region: cn-shenzhen
      functionName: dummy-service$dummy-function
      handler: dummy-handler
      runtime: custom
      codeUri: ./
```

### v2 示例
```yaml
# s.yaml
services:
  default:
    actions:
      post-deploy:
        - plugin: refresh-cdn-cache
          args:
            # cdn: aliyun 
            # 支持直接读取 s 中已配置的 access 作为访问凭据
            access: cdn
            paths:
              # 刷新单个 URL
              - https://blog.dengchao.fun/index.html
              # 刷新单个目录
              - https://blog.dengchao.fun/tag/
              # 使用 ^ 开头 $ 结尾的表达式进行匹配
              - ^https://blog.dengchao.fun/2022/.*$
    component: devsapp/fc
    props:
      region: cn-shenzhen
      service:
        name: dummy-service
      function:
        name: dummy-function
        handler: dummy-handler
        runtime: custom
        codeUri: ./
```

## 参数说明

+ paths: 待刷新的 URL.
    + 说明: 必填, 可填写单个字符串或者字符串数组. <br/>
      当以 `/` 结尾时, 刷新整个目录. 当以 `^` 开头并以 `$` 结尾时刷新匹配表达式的全部 URL.
    + 示例值: `https://example.com/`
+ cdn: CDN 服务供应商标识.
    + 说明: 选填, 当该参数未填写时, 将通过 service.component 来推断对应的取值. 不区分大小写.
    + 示例值:
        + `aliyun`
        + `alibaba`
+ access: @serverless-devs/s 配置列表中的其中一个配置别名.
    + 说明: 选填, 当填写该参数时, 插件将尝试加载对应的配置作为操作 CDN 时的密钥. 区分大小写.
    + 示例值:
        + `default`
+ accessKeyId: 选填, 访问密钥 ID.
+ accessKeySecret: 选填, 访问密钥密码.

### 密钥加载优先级

该插件将按下列优先级顺序, 由高到底依次尝试加载用于操作 CDN 的密钥:

1. args 中显式提供的 `accessKeyId`, `accessKeySecret` 等参数.
2. args 中 `access` 参数对应的 @serverless-devs/s 配置项.
3. 环境变量中的 `ALIYUN_CDN_ACCESS_KEY_ID` 等参数.
4. 当前正在操作 @serverless-devs/s 命令行工具的密钥.
    1. s.yaml 文档的 service 对象中 `access` 参数对应的 @serverless-devs/s 配置项.
    2. s.yaml 文档根对象中 `access` 参数对应的 @serverless-devs/s 配置项.

### 环境变量命名规则

当使用环境变量来提供操作 CDN 所需的密钥时, 应当按 `${CDN}_CDN_${密钥字段}` 或 `CDN_${密钥字段}` 的格式对环境变量进行命名.

以阿里云 CDN 为例: `CDN` 的值 `ALIYUN`, 密钥字段包括 `ACCESS_KEY_ID` 与 `ACCESS_KEY_SECRET` 两部分.
因此完整的环境变量名为: `ALIYUN_CDN_ACCESS_KEY_ID` 或 `CDN_ACCESS_KEY_ID`, 以及 `ALIYUN_CDN_ACCESS_KEY_SECRET`
或 `CDN_ACCESS_KEY_SECRET`.

## 其他

+ 本插件源码仓库地址：https://github.com/DevDengChao/refresh-cdn-cache
+ 你可以在这里找到更多有趣的东西：https://blog.dengchao.fun

## License

[MIT](./LICENSE)
