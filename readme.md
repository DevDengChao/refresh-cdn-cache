# Refresh CDN cache plugin for @Serverless-Devs/s

[![Node.js CI](https://github.com/DevDengChao/refresh-cdn-cache/actions/workflows/default.yml/badge.svg?branch=master&event=push)](https://github.com/DevDengChao/refresh-cdn-cache/actions/workflows/default.yml)

此插件可以帮你在 [Serverless-Devs](https://github.com/Serverless-Devs/Serverless-Devs) 运行过程中刷新指定 URL 上的 CDN 缓存.

## 如何使用

在 s.yaml 文件的 `post-deploy` 插槽中声明该插件即可:

```yaml
services:
  default:
    actions:
      post-deploy:
        - plugin: refresh-cdn-cache
          args:
            cdn: aliyun
            accessKeyId: ${env(CDN_ACCESS_KEY_ID)}
            accessKeySecret: ${env(CDN_ACCESS_KEY_SECRET)}
            paths: https://blog.dengchao.fun/index.html
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
    + 说明: 必填, 可填写单个字符串或者字符串数组.
    + 示例值: `https://example.com/`
+ cdn: CDN 服务供应商标识.
    + 说明: 选填, 当该参数未填写时, 将通过 service.component 来推断对应的取值. 不区分大小写.
    + 示例值:
        + `aliyun`
        + `alibaba`
+ access: @serverless-devs/s 配置列表中的其中一个配置别名.
    + 说明: 选填, 当填写该参数时, 插件将尝试加载对应的密钥作为操作 CDN 时的密钥. 区分大小写.
    + 示例值:
        + `default`
+ accessKeyId: 访问密钥 ID.
+ accessKeySecret: 访问密钥密码.

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

## License

[MIT](./LICENSE)
