class NaiveBayes {
    means = []
    stdevs = []
    labels

    /**Trains the model on the given data */
    fit(exs, labels) {
        this.labels = labels
        let divided = {}

        for (let i = 0; i < exs.length; i++) {
            let cur = exs[i]
            let lastValue = cur[cur.length - 1]

            if (!divided.hasOwnProperty(lastValue)) {
                divided[lastValue] = []
            }
            divided[lastValue].push(exs[i])
        }

        for (let k = 0; k < Object.keys(divided).length; k++) {
            this.means.push(this.calcMean(divided[k]).slice(0, -1))
            this.stdevs.push(this.calcDev(divided[k], this.means[k]))
        }
        console.log('Labels: ')
        console.log(this.labels)
    }

    calcMean(data) {
        let arr = []

        for (let k = 0; k < data[0].length; k++) {
            let sum = 0.0
            for (let i = 0; i < data.length; i++) {
                sum += data[i][k]
            }
            sum = sum / data.length
            arr.push(sum)
        }
        return arr
    }

    calcDev(data, means) {
        let res = []

        for (let k = 0; k < means.length; k++) {
            let sdPrep = 0.0
            let sdRes = 0.0

            for (let i = 0; i < data.length; i++) {
                sdPrep += Math.pow(data[i][k] - means[k], 2)
            }

            sdRes = Math.sqrt(sdPrep / data.length)
            res.push(sdRes)
        }
        return res
    }

    /**Returns a set of predictions for the given dateset */
    predict(data) {
        let probs = []

        for (let i = 0; i < data.length; i++) {
            probs.push(this.calculateProbs(data[i])) //for every row in the dataset, calculate probabilites
        }

        let preds = []

        /**After we have all the probabilites, we need to determine which label is most correct */
        for (let k = 0; k < probs.length; k++) {
            let bestProb = -1.0
            let bestLabel = null
            for (let j = 0; j < probs[k].length; j++) {
                if (bestLabel == null || probs[k][j] > bestProb) {
                    bestLabel = j
                    bestProb = probs[k][j]
                }
            }
            preds.push(bestLabel)
        }
        return preds
    }

    calculateProbs(data) {
        let probs = []

        for (let i = 0; i < this.means.length; i++) {
            let probability = []
            //For every value on the current row, run calcPDF for it and store the result in probs
            for (let j = 0; j < this.means[i].length; j++) {
                probability.push(
                    this.calcPDF(data[j], this.means[i][j], this.stdevs[i][j]),
                )
            }
            //Then multiply them togeteher
            let sum = 1.0
            for (let k = 0; k < probability.length; k++) {
                sum = sum + probability[k]
            }

            probs.push(Math.exp(sum))
        }
        //We also need to normalize the values
        let sum = 0.0
        //By adding together the values
        for (let n = 0; n < probs.length; n++) {
            sum += probs[n]
        }
        //And then every value by the sum
        for (let r = 0; r < probs.length; r++) {
            probs[r] = probs[r] / sum
        }
        return probs
    }

    calcPDF(x, mean, stdev) {
        let exp = Math.exp(-(Math.pow(x - mean, 2) / (2 * Math.pow(stdev, 2))))
        return Math.log((1 / (Math.sqrt(2 * Math.PI) * stdev)) * exp)
    }
    
    /**Calculate the accuracy scores for a set of predicitions, checked against a dataset */
    accuracy_score(preds, y) {
        let length = preds.length
        let correct = 0
        for (let i = 0; i < preds.length; i++) {
            if (preds[i] == y[i][y[i].length - 1]) {
                correct++
            }
        }
        return (100 * correct) / length
    }

    /**Generate a confusion matrix for a set of predictions */
    confusion_matrix(preds, y) {
        let matrix = []

        //Create a matrix from the labels of the current model
        for (let k = 0; k < Object.keys(this.labels).length; k++) {
            matrix.push([])
            for (let j = 0; j < Object.keys(this.labels).length; j++) {
                matrix[k].push(0)
            }
        }

        for (let i = 0; i < y.length; i++) {
            let label = y[i][y[i].length - 1]
            matrix[label][preds[i]]++
        }

        return matrix
    }
}

module.exports = NaiveBayes
