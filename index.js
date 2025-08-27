const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')
const { json } = require('stream/consumers')

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Oque você deseja fazer? ',
            choices: [
                'Criar conta',
                'Consultar saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }
    ]).then((answer) => {
        const action = answer['action']

        switch (action) {

            case ('Criar conta'): {
                createAccount()
                break;
            }

            case ('Consultar saldo'): {
                getAccountBalance()
                break
            }

            case ('Depositar'): {
                deposit()
                break
            }

            case ('Sacar'): {

                withdraw()
                break
            }

            case ('Sair'): {
                console.log(chalk.bgBlue('Obrigado por usar nosso sistema 24H. \nvolte sempre!!'))
                setTimeout(() => {
                    console.clear()
                    process.exit()
                }, 2000)

            }


            default:
                break;
        }


    }).catch((err) => { console.log('Deu erro aqui na promessa patrão', err) })
}

function createAccount() {
    console.log(chalk.yellow('Obrigado por escolher nosso banco!'))
    console.log(chalk.green('Defina as opcoes da sua conta...'))

    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }


        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Conta ja existente'))

            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err)
        })

        console.log(chalk.green('Parabens conta criado com sucesso'))
        operation()

    }).catch((err) => {
        console.log(err)
    })
}

function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da sua conta'
        }
    ]).then(
        (answer) => {
            const accountName = answer['accountName']


            if (!checkAccount(accountName)) {
                console.log(chalk.bgRed.black('Essa conta não existe! \nDigite uma conta valida'))
                deposit()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Digite o valor do deposito: '
                }
            ]).then((answer) => {

                const amount = answer['amount']

                addAmount(accountName, amount)
                operation()


            }).catch((err) => {
                console.log(err)
            })

        }
    ).catch((err) => {
        console.log(err)
    })
}


function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        return false
    }

    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro durante a execução \nTente novamente'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        (err)=>{
            console.log(err)
        }
    )

    console.log(chalk.bgGreen(`Deposito de R$${amount} realizado com sucesso!`))
}

function getAccount(accountName) {
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r',
    })

    return JSON.parse(accountJson)
}

function getAccountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da sua conta: '
        }
    ]).then(

        (answer)=>{
            const accountName = answer['accountName']

            if(!checkAccount(accountName)){
                return getAccountBalance()
            }

            const accountData = getAccount(accountName)


            console.log(chalk.bgBlue(`Saldo da Conta: R$${accountData.balance}`))
            operation()
        }

    ).catch((err)=>{
        console.log(err)
    })
}


function withdraw(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da sua conta: '
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Valor do saque: '
            }
        ]).then((answer) =>{

            const amount = answer['amount']

            removeAmount(accountName, amount)

        }).catch((err)=>{
            console.log(err)
        })

    }).catch((err)=>{
        console.log(err)
    })
}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro durante a execução \nTente novamente'))
        return withdraw()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black(`Saldo inssuficiente!\nverifique seu saldo e tente novamente`))
        return operation()
    }

    accountData.balance = parseFloat(amount) - parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        (err)=>{
            console.log(err)
        }
    )

    console.log(chalk.bgGreen(`Saque de R$${amount} realizado com sucesso!`))
    operation()
}