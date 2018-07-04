export class Perceptron {

  constructor() {
    this.weights = [Math.random(), Math.random(), Math.random()]
  }

  predict(x, y) {
    return this._activate(x*this.weights[0]+y*this.weights[1]+this.weights[2])
  }

  train(x, y, truth) {
    let error = truth - this.predict(x, y)

    // adjust weights
    let input = [x,y,1]
    this.weights = this.weights.map((weight, i) => 0.4 * error * input[i] + weight)
    // points.forEach(point => point.predicted = this.predict(point.x, point.y) === truth(point.x, point.y))
    return error
  }

  fun(x) {
    return -((x * this.weights[0] + this.weights[2]) / this.weights[1])
  }

  _activate(x) {
    return x > 0 ? 1 : -1
  }
}
