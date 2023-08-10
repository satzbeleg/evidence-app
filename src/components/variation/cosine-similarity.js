import * as tf from "@tensorflow/tfjs";


/**
 * Scale weights to sum of 1
 * 
 * @param {tf.tensor} w vector with weights 
 * @returns scaled weights
 */
const scaleWeights = (w) => {
  const wgt = tf.maximum(0., w)
  const tot = tf.sum(wgt)
  if (tot.dataSync()[0] > 0.){
    return tf.div(wgt, tot)
  }else{
    // return tf.div(tf.ones(w.shape, 'float32'), tf.scalar(w.shape[0]))
    return tf.div(tf.onesLike(w), tf.scalar(w.shape[0]))
  }
}


/** Weighted Cosine Similarity mit TFJS
 * 
 * @param {tf.tensor} f1  First vector
 * @param {tf.tensor} f2  Second vector
 * @param {tf.tensor} w   Normalized weighting scheme (see scaleWeights)
 * @returns 
 */
const weightedCosineSimilarity = (f1, f2, w) => {
  const nom = tf.dot(tf.mul(f1, f2), w)
  const den1 = tf.dot(tf.mul(f1, f1), w)
  const den2 = tf.dot(tf.mul(f2, f2), w)
  const sim = tf.div(nom, tf.sqrt(tf.mul(den1, den2)))
  return sim
}


/**
 * Weighting scheme for `evidence-features`
 * 
 * @returns Array of weights, length=1181
 */
const getWeightingScheme = (
  weightSbert,
  weightPartOfSpeech,
  
  weightMFeatPunctation,
  weightMFeatAdposition,
  weightMFeatParticle,
  weightMFeatPronominal,
  weightMFeatOther,
  weightMFeatVerbform,
  weightMFeatGender,
  weightMFeatNumber,
  weightMFeatPerson,
  weightMFeatCase,
  weightMFeatDegree,
  weightMFeatTense,

  weightNodeTokenDist,
  weightConsonantCluster,
  weightCharFrequency,
  weightBigramFrequency,
  weightLemmaFrequency,
  weightLexemeAmbivalance,
  weightTextLength,
  weightLanguage,
  weightEmoji,
) => {
  // allocate memorty for weights
  let wgt = new Array(1181);

  // Hashed SBert embeddings (1024)
  let i = 0;
  let val = parseFloat(weightSbert) / Number(1024.);
  for (i = 0; i < 1024; i++) {
    wgt[i] = val;
  }

  // Distribution of Part-of-Speech (PoS) tags of a sentence (16)
  val = parseFloat(weightPartOfSpeech) / Number(16.);
  for (i = 1024; i < 1040; i++) { // 1024 + 16
    wgt[i] = val;
  }

  // Morp. Features: Punctation (3)
  val = parseFloat(weightMFeatPunctation) / Number(3.);
  for (i = 1040; i < 1043; i++) { // 1040 + 3
    wgt[i] = val;
  }
  // Morp. Features: Adposition (3)
  val = parseFloat(weightMFeatAdposition) / Number(3.);
  for (i = 1043; i < 1046; i++) { // 1043 + 3
    wgt[i] = val;
  }
  // Morp. Features: Particle (3)
  val = parseFloat(weightMFeatParticle) / Number(3.);
  for (i = 1046; i < 1049; i++) { // 1046 + 3
    wgt[i] = val;
  }
  // Morp. Features: pronominal (6)
  val = parseFloat(weightMFeatPronominal) / Number(6.);
  for (i = 1049; i < 1055; i++) { // 1049 + 6
    wgt[i] = val;
  }
  // Morp. Features: Other (8)
  val = parseFloat(weightMFeatOther) / Number(8.);
  for (i = 1055; i < 1063; i++) { // 1055 + 8
    wgt[i] = val;
  }
  // Morp. Features: Verbform (7)
  val = parseFloat(weightMFeatVerbform) / Number(7.);
  for (i = 1063; i < 1070; i++) { // 1063 + 7
    wgt[i] = val;
  }
  // Morp. Features: Gender (3)
  val = parseFloat(weightMFeatGender) / Number(3.);
  for (i = 1070; i < 1073; i++) { // 1070 + 3
    wgt[i] = val;
  }
  // Morp. Features: Number (2)
  val = parseFloat(weightMFeatNumber) / Number(2.);
  for (i = 1073; i < 1075; i++) { // 1073 + 2
    wgt[i] = val;
  }
  // Morp. Features: Person (3)
  val = parseFloat(weightMFeatPerson) / Number(3.);
  for (i = 1075; i < 1078; i++) { // 1075 + 3
    wgt[i] = val;
  }
  // Morp. Features: Case (4)
  val = parseFloat(weightMFeatCase) / Number(4.);
  for (i = 1078; i < 1082; i++) { // 1078 + 4
    wgt[i] = val;
  }
  // Morp. Features: Degree (3)
  val = parseFloat(weightMFeatDegree) / Number(3.);
  for (i = 1082; i < 1085; i++) { // 1082 + 3
    wgt[i] = val;
  }
  // Morp. Features: Tense (2)
  val = parseFloat(weightMFeatTense) / Number(2.);
  for (i = 1085; i < 1087; i++) { // 1085 + 2
    wgt[i] = val;
  }

  // Distribution of Node-Token-Distance (21)
  val = parseFloat(weightNodeTokenDist) / Number(21.);
  for (i = 1087; i < 1108; i++) { // 1087 + 21
    wgt[i] = val;
  }

  // Consonant Cluster (3)
  val = parseFloat(weightConsonantCluster) / Number(3.);
  for (i = 1108; i < 1111; i++) { // 1108 + 3
    wgt[i] = val;
  }

  // Char Frequency (6)
  val = parseFloat(weightCharFrequency) / Number(6.);
  for (i = 1111; i < 1117; i++) { // 1111 + 6
    wgt[i] = val;
  }

  // Bigram Frequency (10)
  val = parseFloat(weightBigramFrequency) / Number(10.);
  for (i = 1117; i < 1127; i++) { // 1117 + 10
    wgt[i] = val;
  }

  // Lemma Frequency (6)
  val = parseFloat(weightLemmaFrequency) / Number(6.);
  for (i = 1127; i < 1133; i++) { // 1127 + 6
    wgt[i] = val;
  }

  // Lexeme Ambivalance (14)
  val = parseFloat(weightLexemeAmbivalance) / Number(14.);
  for (i = 1133; i < 1147; i++) { // 1133 + 14
    wgt[i] = val;
  }

  // Text Length (2)
  val = parseFloat(weightTextLength) / Number(2.);
  for (i = 1147; i < 1149; i++) { // 1147 + 2
    wgt[i] = val;
  }

  // Language (10)
  val = parseFloat(weightLanguage) / Number(10.);
  for (i = 1149; i < 1159; i++) { // 1149 + 10
    wgt[i] = val;
  }

  // Emoji (22)
  val = parseFloat(weightEmoji) / Number(22.);
  for (i = 1159; i < 1181; i++) { // 1159 + 22
    wgt[i] = val;
  }

  return wgt;
}



export {
  weightedCosineSimilarity, 
  scaleWeights 
}


// let f1 = tf.tensor1d([.1,.2,+.3,-.4,-.5])
// let f2 = tf.tensor1d([.1,.2,-.3,-.4,-.5])
// //f2 = tf.mul(f1, tf.scalar(2.))
// //let w = tf.tensor1d([1., 1., .5, 1., 1.])
// let w = tf.tensor1d([0., 0., 0., 0., 0.])
// w = scaleWeights(w)
// w.print()
// s = weightedCosineSimilarity(f1, f2, w)
// s.print()


