## Fabric.js

[Official Documentation](http://fabricjs.com/)

[Official Github Repository](https://github.com/fabricjs/fabric.js)

**Forked `Fabric.js@v5.3.1` and `@types/fabric`.**

It includes both, eliminating the need to install @types/fabric. Additionally, within the build package, apart from fabric, it also incorporates an `erasing`.

## Addition

Add next dir from `Fabric.js@v6.0.0-rc.0` for fix image clip [error](https://github.com/fabricjs/fabric.js/issues/8517). 

**It is not within the constructed package,so need manual copy to your project. If the official 6.0.0 package has been released, it is advisable to use the official version.**

Usage: Copy `next` to your project and import `AheadAPI`.

```js
class <your class> extends AheadAPI {
    // ...

    onClip() {
        // ...
        this.sendObjectToPlane(clipPath, undefined, target.calcTransformMatrix());
        newRect.set({ clipPath });
    }
}
```
