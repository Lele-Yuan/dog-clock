# electron 基础学习

## 发布新版本
.github/workflows/build.yml 监听的是 tag 的 push 事件，所以如果要触发构建需要打一个 tag。

```
on:
    push:
        tags:
          - '*'
```

- 打标签 git tag v1.0.0
- 删除标签 git tag -d v1.0.0
- 检出标签 git checkout v1.0.0
- 提交至远程 git push origin v1.0.0