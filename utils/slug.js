import slugify from 'slugify';

export default (name) => {
    return slugify(name, {lower: true}).replace(/[^\w\-]+/g);
}