const fs = require('fs')

	async  function push(file, content) {
		const currentContent = await read(file)
        currentContent.push(content)
        const contentFile = await JSON.stringify(currentContent, null, 2)
        fs.writeFileSync(file, contentFile, 'utf-8', 2)
	}
	async  function read(file) {
		//reading to file
		try{
			let content = await fs.readFileSync(file, 'utf-8')
			return JSON.parse(content)
		}
		//if file no content
		catch(err){
			content = fs.writeFileSync(file, "[]", 'utf-8')
			return JSON.parse("[]")
		}
	}
    async function update(file, id, content){
        const currentContent = await read(file)
        const selectedItem = currentContent.findIndex(item => item.id === id.toString())
        currentContent[selectedItem] = {
            id: id.toString(),
            name: content
        }

        const contentFile = await JSON.stringify(currentContent, null, 2)
        fs.writeFileSync(file, contentFile, 'utf-8', 2)
    }
    async function remove(file, id){
        const currentContent = await read(file)
        const selectedItem = currentContent.findIndex(item => item.id === id.toString())
        currentContent.splice(selectedItem, 1)

        const contentFile = await JSON.stringify(currentContent, null, 2)
        fs.writeFileSync(file, contentFile, 'utf-8', 2)
    }

module.exports = {
	push,
	read,
    update,
    remove
}
