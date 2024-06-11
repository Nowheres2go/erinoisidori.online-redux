module.exports = function (config) {
    config.addPassthroughCopy("./assets/**")
    config.addPassthroughCopy("./oldworks/**")

    config.addFilter("shortDate", dateObj => {
        if (dateObj === undefined) return dateObj
        return dateObj.toLocaleDateString('en-CA');
    });

    config.addFilter("debug", data => {
        return JSON.stringify(data)
    });


    // determines and returns the "pretty name" of the provided post's type. i.e. posts in the 'art' collection are 'artwork's.
    config.addFilter("postType", data => {
        const names = {
            'art': 'artwork',
            'posts': 'blog post',
        }

        for (const tag of data.data.tags) {
            if (!!names[tag]) return names[tag]
        }

        return ""
    })

    config.addCollection('works', function (collection) {
        return collection
            .getAll()
            .filter(item => {
                return item.data.tags?.includes('art')
                    || item.data.tags?.includes('posts')
            })
            .sort((a, b) => a.data.date > b.data.date)
    });
}
