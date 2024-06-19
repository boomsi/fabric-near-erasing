## Fabric.js

[Official Documentation](http://fabricjs.com/)

[Official Github Repository](https://github.com/fabricjs/fabric.js)

**Forked `Fabric.js@v5.3.1` and `@types/fabric`.**

Fixed some bugs and added some features. See [Difference](#Difference).

## Difference

1. Add next dir from `Fabric.js@v6.0.0-rc.0` for fix image clip [error](https://github.com/fabricjs/fabric.js/issues/8517).

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

2. Add loading image failed status

```js
// utils/misc.js:467
// Placeholder image when image loading fails,it will reload when page refresh.

// Just setting once, it will be effective for all fabric.Image objects.
fabric.Object.prototype.loadImageFiledSrc = "/xxx.png";
```

3. When two elements overlap on the Z-axis, if the element at the bottom is selected, clicking and dragging the overlapping part of the two elements will not switch to the topmost element

```js
// _searchPossibleTargets:811-825

// how to use
fabric.Object.prototype.moveWithOverlapping = true;
```

4. Add new Textbox wrap mode, it will auto wrap when change width, like keynote.

```js
// src/controls.actions.js:692-694

// how to use
new fabric.Textbox("text", {
  // ...
  autoWrapAfterChangeWidth: true,
});
```

5. When removing the export to the left, top, scaleX, scaleY, do to Fixed Angle parameters, because everywhere when the repair is imported to the accuracy of the loss, as a result of Fixed the problem. See [Discussions](https://github.com/fabricjs/fabric.js/discussions/9438)

```js
// src/shapes/object.class.js:843-880

```
6. If you get the information of an element in an activeSelection, you will get the information relative to the activeSelection. You can get the information of the element relative to the canvas through this method.

```js
  // src/canvas.class.js:1260
  const originalInfo = canvas.getOriginalObjectInfo(canvas.getActiveObjects()[0])
```