import converter from 'pdf2jpg';

export default async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('url required');
    }
    const buffer = await converter(url);
    res.setHeader('content-type', 'image/jpeg');
    res.setHeader('cache-control', 's-maxage=31536000');
    res.send(buffer);
}
