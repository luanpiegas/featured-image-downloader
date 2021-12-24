const fs = require('fs')  
const axios = require('axios')
const path = require('path')  
const domain = 'https://example.com'
const perPage = 100

async function downloadImage(id) {  
	const url = `${domain}/wp-json/wp/v2/media/${id}`
	const uploads = path.resolve(__dirname, 'images', `${id}.jpg`)
	const writer = fs.createWriteStream(uploads)

	axios.get(url)
	.then(res => {
		axios({
			method: "get",
			url: res.data.guid.rendered,
			responseType: "stream"
		}).then(function (response) {
			response.data.pipe(writer);
		});
	})
	.catch(err => {
		console.log(err)
	})
}

axios.get(`${domain}/wp-json/wp/v2/posts?per_page=${perPage}`)
.then(res => {
    res.data.forEach(item => {
        downloadImage(item.featured_media)  
    });
    
})
.catch(err => {
	console.log(`Error: ${err}`)
})
