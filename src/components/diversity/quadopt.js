import * as tf from '@tensorflow/tfjs';

export const useQuadOpt = () => {
  /**
   * @param  {...any} args 
   * @returns {tf.tensor}  
   * 
   * Example:
   * --------
      const { aggregate_matrices } = useQuadOpt()
      let simi1 = [[1., 2], [3, 4]]
      let beta1 = 2.
      let simi2 = [[5., 6], [7, 8]]
      let beta2 = 0.5
      let simi = aggregate_matrices(simi1, beta1, simi2, beta2)
      simi.print()
   * 
   */
  const aggregate_matrices = (...args) => {
    // check inputs
    if (args.length % 2){
      throw "An even number of input arguments expected";
    }
    // // copy the first matrix
    var out = tf.tensor(args[0], undefined, 'float32').mul(tf.tensor(args[1], [1], 'float32'))

    // add the other matrices
    for (let i = 2; i < args.length; i+=2){
      out = out.add(tf.tensor(args[i], undefined, 'float32').mul(tf.tensor(args[i + 1], [1], 'float32')))
    }
    // done
    return out
  }

  /** Norm to 1 */
  const norm_to_1 = (w) => {
    let v = w.sub(tf.minimum(0., w.min()))
    return v.div(tf.maximum(1e-8, v.sum()))
  }

  /** loss function with regularization */
  const custom_loss = (w, c, lamQ, b) => {
    // norm to 1
    let v = norm_to_1(w)
    // quadratic problem
    let loss = tf.tensor(0.0)
    loss = loss.sub(tf.dot(c, v))
    loss = loss.add(tf.sqrt(tf.dot(tf.dot(lamQ, v), v)))
    // regularization: sum_i w_i = 1
    loss = loss.add(tf.pow(tf.tensor(1.).sub(w.sum()), 2))
    // regularization: w_i >= 0
    loss = loss.add(tf.sum(tf.tensor(0.).sub(tf.minimum(w, 0.0))))
    // regularization: w_i leq b
    loss = loss.add(tf.sum(tf.tensor(0.).sub(tf.minimum(b - w, 0.0))))
    return loss
  }

  /** 
   * Maximize "total goodness" and minimize "total similarity"
   * @param {Array} c 
   * @param {Array} Q 
   * @param {Float} lam 
   * @param {Int} maxiter 
   * @param {Float} ftol 
   * @param {Int} patience 
   * @returns {tf.tensor} wbest
   */
  const get_weights = (c, Q, lam, b=undefined, maxiter=500, ftol=1e-06, patience=20) => {
    console.group()
    console.log(`Max. num of iterations: ${maxiter}`)
    console.log(`Termination ftol: ${ftol}`)
    console.log(`Termination patience: ${patience}`)
    console.log(`Lambda: ${lam}`)

    if(lam < 0.0){
      throw "the preference lambda='{lam}' must be positive"
    }

    // cast
    if( !(c instanceof tf.Tensor) ){
      c = tf.tensor(c, undefined, 'float32')  // (n,)
    }

    // We can multipy `lam*Q` beforehand and save compute time! And cast
    if( !(Q instanceof tf.Tensor) ){
      Q = tf.tensor(Q, undefined, 'float32')
    }
    const lamQ = Q.mul(lam)  // (n,n)

    // how many alternatives
    const n_examples = c.shape[0]

    // trainable params with initial values
    let w = tf.variable(tf.ones([n_examples]).div(n_examples), true)

    // set default upper boundary
    if( typeof b !== 'undefined'){
      b = tf.minimum(tf.tensor(1.0), tf.tensor(2.0).div(tf.tensor(n_examples, undefined, 'float32')))
    }

    // https://js.tensorflow.org/api/latest/#tf.train.Optimizer.minimize
    const optimizer = tf.train.adam(0.0003, .9, .999, 1e-7)

    // start values
    let f, wbest;
    let fbest = custom_loss(w, c, lamQ, b)
    let wait = 0;
    // start optimization
    for(let i=0; i < maxiter; i++){
      optimizer.minimize(() => custom_loss(w, c, lamQ, b))
      f = custom_loss(w, c, lamQ, b)
      if (fbest > (f + ftol)){
        fbest = f;
        wbest = norm_to_1(w);
        wait = 0;
      }else{
        wait++;
        if (wait > patience){
          console.log(`Early stopping in the ${i}-th iteration.`)
          wbest.print(); fbest.print();
          break;
        }
      }
    }

    console.groupEnd()
    return wbest
  }

  return {
    aggregate_matrices,
    get_weights
  }
}