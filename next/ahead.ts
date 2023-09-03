type TMat2D = [number, number, number, number, number, number];
interface IPoint {
  x: number;
  y: number;
}

class AheadAPI {
  sendObjectToPlane(
    object: any,
    from = Object.freeze([1, 0, 0, 1, 0, 0]) as TMat2D,
    to = Object.freeze([1, 0, 0, 1, 0, 0]) as TMat2D
  ) {
    const t = this.multiplyTransformMatrices(this.invertTransform(to), from);
    this.applyTransformToObject(
      object,
      this.multiplyTransformMatrices(t, object.calcOwnMatrix())
    );
    return t;
  }

  invertTransform(t: TMat2D): TMat2D {
    const a = 1 / (t[0] * t[3] - t[1] * t[2]),
      r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0] as TMat2D,
      { x, y } = this.transformPoint(new Point(t[4], t[5]), r, true);
    r[4] = -x;
    r[5] = -y;
    return r;
  }

  transformPoint(p: Point | IPoint, t: TMat2D, ignoreOffset?: boolean): Point {
    return new Point(p).transform(t, ignoreOffset);
  }

  multiplyTransformMatrices(a: TMat2D, b: TMat2D, is2x2?: boolean): TMat2D {
    return [
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
      is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4],
      is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5]
    ] as TMat2D;
  }

  applyTransformToObject(object: any, transform: TMat2D) {
    const { translateX, translateY, scaleX, scaleY, ...otherOptions } =
        this.qrDecompose(transform),
      center = new Point(translateX, translateY);
    object.flipX = false;
    object.flipY = false;
    Object.assign(object, otherOptions);
    object.set({ scaleX, scaleY });
    object.setPositionByOrigin(center, 'center', 'center');
  }

  qrDecompose(a: TMat2D) {
    const angle = Math.atan2(a[1], a[0]),
      denom = Math.pow(a[0], 2) + Math.pow(a[1], 2),
      scaleX = Math.sqrt(denom),
      scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX,
      skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom),
      PiBy180 = Math.PI / 180;
    return {
      angle: angle / PiBy180,
      scaleX,
      scaleY,
      skewX: skewX / PiBy180,
      skewY: 0,
      translateX: a[4],
      translateY: a[5]
    };
  }
}

class Point {
  x: number;

  y: number;

  type = 'point';

  constructor();
  constructor(x: number, y: number);
  constructor(point: IPoint);
  constructor(arg0: number | IPoint = 0, y = 0) {
    if (typeof arg0 === 'object') {
      this.x = arg0.x;
      this.y = arg0.y;
    } else {
      this.x = arg0;
      this.y = y;
    }
  }

  /**
   * Adds another point to this one and returns another one
   * @param {Point} that
   * @return {Point} new Point instance with added values
   */
  add(that: IPoint): Point {
    return new Point(this.x + that.x, this.y + that.y);
  }

  /**
   * Adds another point to this one
   * @param {Point} that
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  addEquals(that: IPoint): Point {
    this.x += that.x;
    this.y += that.y;
    return this;
  }

  /**
   * Adds value to this point and returns a new one
   * @param {Number} scalar
   * @return {Point} new Point with added value
   */
  scalarAdd(scalar: number): Point {
    return new Point(this.x + scalar, this.y + scalar);
  }

  /**
   * Adds value to this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  scalarAddEquals(scalar: number): Point {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  /**
   * Subtracts another point from this point and returns a new one
   * @param {Point} that
   * @return {Point} new Point object with subtracted values
   */
  subtract(that: IPoint): Point {
    return new Point(this.x - that.x, this.y - that.y);
  }

  /**
   * Subtracts another point from this point
   * @param {Point} that
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  subtractEquals(that: IPoint): Point {
    this.x -= that.x;
    this.y -= that.y;
    return this;
  }

  /**
   * Subtracts value from this point and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarSubtract(scalar: number): Point {
    return new Point(this.x - scalar, this.y - scalar);
  }

  /**
   * Subtracts value from this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  scalarSubtractEquals(scalar: number): Point {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  /**
   * Multiplies this point by another value and returns a new one
   * @param {Point} that
   * @return {Point}
   */
  multiply(that: Point): Point {
    return new Point(this.x * that.x, this.y * that.y);
  }

  /**
   * Multiplies this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarMultiply(scalar: number): Point {
    return new Point(this.x * scalar, this.y * scalar);
  }

  /**
   * Multiplies this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  scalarMultiplyEquals(scalar: number): Point {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Divides this point by another and returns a new one
   * @param {Point} that
   * @return {Point}
   */
  divide(that: IPoint): Point {
    return new Point(this.x / that.x, this.y / that.y);
  }

  /**
   * Divides this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarDivide(scalar: number): Point {
    return new Point(this.x / scalar, this.y / scalar);
  }

  /**
   * Divides this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  scalarDivideEquals(scalar: number): Point {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Returns true if this point is equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  eq(that: IPoint): boolean {
    return this.x === that.x && this.y === that.y;
  }

  /**
   * Returns true if this point is less than another one
   * @param {Point} that
   * @return {Boolean}
   */
  lt(that: IPoint): boolean {
    return this.x < that.x && this.y < that.y;
  }

  /**
   * Returns true if this point is less than or equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  lte(that: IPoint): boolean {
    return this.x <= that.x && this.y <= that.y;
  }

  /**
  
     * Returns true if this point is greater another one
     * @param {Point} that
     * @return {Boolean}
     */
  gt(that: IPoint): boolean {
    return this.x > that.x && this.y > that.y;
  }

  /**
   * Returns true if this point is greater than or equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  gte(that: IPoint): boolean {
    return this.x >= that.x && this.y >= that.y;
  }

  /**
   * Returns new point which is the result of linear interpolation with this one and another one
   * @param {Point} that
   * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
   * @return {Point}
   */
  lerp(that: IPoint, t = 0.5): Point {
    t = Math.max(Math.min(1, t), 0);
    return new Point(
      this.x + (that.x - this.x) * t,
      this.y + (that.y - this.y) * t
    );
  }

  /**
   * Returns distance from this point and another one
   * @param {Point} that
   * @return {Number}
   */
  distanceFrom(that: IPoint): number {
    const dx = this.x - that.x,
      dy = this.y - that.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Returns the point between this point and another one
   * @param {Point} that
   * @return {Point}
   */
  midPointFrom(that: IPoint): Point {
    return this.lerp(that);
  }

  /**
   * Returns a new point which is the min of this and another one
   * @param {Point} that
   * @return {Point}
   */
  min(that: IPoint): Point {
    return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
  }

  /**
   * Returns a new point which is the max of this and another one
   * @param {Point} that
   * @return {Point}
   */
  max(that: IPoint): Point {
    return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
  }

  /**
   * Returns string representation of this point
   * @return {String}
   */
  toString(): string {
    return this.x + ',' + this.y;
  }

  /**
   * Sets x/y of this point
   * @param {Number} x
   * @param {Number} y
   * @chainable
   */
  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Sets x of this point
   * @param {Number} x
   * @chainable
   */
  setX(x: number) {
    this.x = x;
    return this;
  }

  /**
   * Sets y of this point
   * @param {Number} y
   * @chainable
   */
  setY(y: number) {
    this.y = y;
    return this;
  }

  /**
   * Sets x/y of this point from another point
   * @param {Point} that
   * @chainable
   */
  setFromPoint(that: Point) {
    this.x = that.x;
    this.y = that.y;
    return this;
  }

  /**
   * Swaps x/y of this point and another point
   * @param {Point} that
   */
  swap(that: Point) {
    const x = this.x,
      y = this.y;
    this.x = that.x;
    this.y = that.y;
    that.x = x;
    that.y = y;
  }

  /**
   * return a cloned instance of the point
   * @return {Point}
   */
  clone(): Point {
    return new Point(this.x, this.y);
  }

  /**
   * Rotates `point` around `origin` with `radians`
   * @static
   * @memberOf fabric.util
   * @param {Point} origin The origin of the rotation
   * @param {TRadian} radians The radians of the angle for the rotation
   * @return {Point} The new rotated point
   */
  // rotate(radians: any, origin: Point = new Point(0, 0)): Point {
  //   // TODO benchmark and verify the add and subtract how much cost
  //   // and then in case early return if no origin is passed
  //   const sinus = sin(radians),
  //     cosinus = cos(radians);
  //   const p = this.subtract(origin);
  //   const rotated = new Point(
  //     p.x * cosinus - p.y * sinus,
  //     p.x * sinus + p.y * cosinus
  //   );
  //   return rotated.add(origin);
  // }

  /**
   * Apply transform t to point p
   * @static
   * @memberOf fabric.util
   * @param  {TMat2D} t The transform
   * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
   * @return {Point} The transformed point
   */
  transform(t: TMat2D, ignoreOffset = false): Point {
    return new Point(
      t[0] * this.x + t[2] * this.y + (ignoreOffset ? 0 : t[4]),
      t[1] * this.x + t[3] * this.y + (ignoreOffset ? 0 : t[5])
    );
  }
}


export default AheadAPI