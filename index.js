const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')

operation()

function operation(){
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
    ]).then((answer) =>{
        const action = answer['action']

        switch(action){
            
            case 'Criar conta':
                createAccount()
                break;
        
            default:
                break;
        }


    }).catch((err) => {console.log('Deu erro aqui na promessa patrão', err)})
}

function createAccount(){
    console.log(chalk.yellow('Obrigado por escolher nosso banco!'))
    console.log(chalk.green('Defina as opcoes da sua conta...'))

    buildAccount()
}

function buildAccount(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite seu nome completo'
        }
    ]).then((answer)=>{
        const accountName = answer['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }


        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('Conta ja existente'))

            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err){
            console.log(err)
        })

        console.log(chalk.green('Parabens conta criado com sucesso'))
        operation()

    }).catch((err) => {
        console.log(err)
    })
}