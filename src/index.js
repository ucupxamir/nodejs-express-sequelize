const web = require('./app/web')

const port = process.env.PORT || 8082

web.listen(port, () => {
    console.log(`api running at port ${port}`)
})