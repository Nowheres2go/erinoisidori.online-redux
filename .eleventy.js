module.exports = function(config) {
    config.addPassthroughCopy("./assets/styles/**")
    config.addPassthroughCopy("./assets/svg/**")
    config.addPassthroughCopy("./assets/scripts/**")
    config.addPassthroughCopy("./assets/blog/**")
    config.addPassthroughCopy("./oldworks/**")


    config.addFilter("shortDate", dateObj => {
        return dateObj.toLocaleDateString('en-CA');
    });}
