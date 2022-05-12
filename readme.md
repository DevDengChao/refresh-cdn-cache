# Refresh CDN cache plugin for @Serverless-Devs/s

此插件可以帮你在 @serverless-devs/s 运行过程中刷新指定 URL 上的 CDN 缓存.

## 如何使用

在 s.yaml 文件的 `post-deploy` 插槽中声明该插件即可:

```yaml{4-9}
services:
  default:
    actions:
      post-deploy:
        - plugin: DevDengChao/refresh-cdn-cache
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
      目前可以使用的值包括:
        + `aliyun`
        + `alibaba`
+ accessKeyId: 访问密钥 ID.
+ accessKeySecret: 访问密钥密码.

## License

MIT
