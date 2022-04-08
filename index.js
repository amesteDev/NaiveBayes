const express = require('express')
const Load = require('./data/load')

const Naive = require('./NaiveBayes')
const l = new Load()

const app = express()

app.use(express.static(__dirname + '/static/'))

const PORT = process.env.PORT || 3000

const load = async () => {
    let irisNaive = new Naive()
    let bankNaive = new Naive()
    let iris = await l.load('./data/iris.csv')
    let bank = await l.load('./data/banknote_authentication.csv')

    let irisLabels = l.createLookup(iris)
    let bankLabels = l.createLookup(bank)

    irisNaive.fit(iris, irisLabels)
    console.log('Finished training model with iris dataset \n')
    bankNaive.fit(bank, bankLabels)
    console.log('Finished training model with banknote dataset \n')

    let irisPredict = irisNaive.predict(iris)
    let bankPredict = bankNaive.predict(bank)

    let irisMatrix = irisNaive.confusion_matrix(irisPredict, iris)
    let bankMatrix = bankNaive.confusion_matrix(bankPredict, bank)
    console.log(
        'Accuracy for the iris dataset is: ' +
            irisNaive.accuracy_score(irisPredict, iris).toFixed(2),
    )
    console.log('Matrix for iris: ')
    for (let i = 0; i < irisMatrix.length; i++) {
        console.log(irisMatrix[i])
    }
    console.log(
        'Accuracy for the banknote dataset i: ' +
            bankNaive.accuracy_score(bankPredict, bank).toFixed(2),
    )
    console.log('Matrix for banknotes: ')
    for (let i = 0; i < bankMatrix.length; i++) {
        console.log(bankMatrix[i])
    }
}

app.listen(PORT, () => {
    load()

    console.log('Server is running on port: ' + PORT)
})
