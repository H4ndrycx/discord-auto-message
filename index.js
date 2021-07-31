const db = require('./database')
const axios = require('axios')
const config = require('./config.json')

if(config.token == ""){
    return console.log(`[ERROR] ---> Configure the account token in ${__dirname}/config.json`)
}

if(process.argv.length > 2){
    const exp = process.argv[2].toLowerCase()
    switch (exp) {
        case 'add':
            add_user(process.argv[3], process.argv[4])
            break;
        case 'remove':
            remove_user(process.argv[3])
            break;
        case 'rename':
            rename_user(process.argv[3], process.argv[4])
            break;
        case 'list':
            list_users()
            break;
        case 'send':
            send_message()
            break;
        default:
            console.log("[ERROR] ---> Invalid option")
    }
}
else{
    console.log("[ERROR] ---> Enter an option")
}

// list all users ./database/users.json
async function list_users(){
    db.read('./database/users.json')
        .then((users) => {
            if(users.length == 0) return console.log(` ---> Not found users to list`) 
            console.log("---> List all users\n")
            users.forEach((value) => {
                console.log(`Name: ${value.name}\nDM: ${value.id}\n`)
            })
        })
}

// add user to ./database/users.json
async function add_user(id, name) {
    const number = /^[0-9]*$/g
    const users = await db.read('./database/users.json')
    if(!id || !name) return console.log(`Inform the dm_id and username`)
    if(!id.match(number) || id.length != 18) return console.log(`DM_ID is incorret`)
    if(users.find(user => user.id == id)) return console.log(`User has already been added`)

    const content = {
        id: id.toString(),
        name: name
    }
    db.push('./database/users.json', content)
    console.log(`${name}, Add to database`)
}

// remove user to ./database/users.json
async function remove_user(id) {
    const number = /^[0-9]*$/g
    const users = await db.read('./database/users.json')
    const user = await users.find(user => user.id == id)
    if(!id) return console.log(`Inform the dm_id`)
    if(!id.match(number) || id.length != 18) return console.log(`DM_ID is incorret`)
    if(!user) return console.log(`User not found`)

    db.remove('./database/users.json', id)
    console.log(`${user.name}, Removed to database`)
}

// rename user to ./database/users.json
async function rename_user(id, new_name) {
    const number = /^[0-9]*$/g
    const users = await db.read('./database/users.json')
    const user = await users.find(user => user.id == id)
    if(!id || !new_name) return console.log(`Inform the dm_id and username`)
    if(!id.match(number) || id.length != 18) return console.log(`DM_ID is incorret`)
    if(!user) return console.log(`User not found`)

    db.update('./database/users.json', id, new_name)
    console.log(`${user.name}, renamed to ${new_name}`)
}

// send message users
async function send_message(){
    const args = process.argv
    args.splice(0, 3)
    const msg = args.join(" ")
    const users = await db.read('./database/users.json')
    let counter = 0

    const data = {
        "content": msg,
        "tts": "false",
    }
    const headers = {
        "authorization": config.token.toString(),
        "content-type": "application/json"
    }

    for(let i = 0; i < users.length; i++){
        setTimeout(async () => {
            const res = await axios.post(
                `https://discord.com/api/v9/channels/${users[i].id}/messages`,
                data,
                {headers: headers})
                .then(() => {
                    console.log(`Sending message to ${users[i].name}...`)
                })
                .catch(() => {
                    console.log(`Error to sending to ${users[i].name}`)
                })


        }, 1000 * counter)
        counter += Math.floor(Math.random() * 8) + 1
    }
}


/* Created by:
 *  ____            _               
 * | __ )    ___   | |__    _   _   
 * |  _ \   / _ \  | '_ \  | | | |  
 * | |_) | | (_) | | |_) | | |_| |  
 * |____/   \___/  |_.__/   \__, |  
 *                          |___/   
 */




