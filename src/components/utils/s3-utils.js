import AWS from 'aws-sdk';



export const testConnectionS3Bucket = async ({
    bucketName,
    accessKeyId,
    secretAccessKey,
    region
}) => {
    const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region,
        signatureVersion: 'v4'
    });
    try {
        return (await s3.headBucket({ Bucket: bucketName }).promise()).$response.httpResponse.statusCode === 200;
    } catch (error) {
        return false;

    }
};

export const getS3FolderList = async (
    { bucketName, accessKeyId, secretAccessKey, region }
) => {
    const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region,
        signatureVersion: 'v4'
    });
    try {
        const folderTest = /^([\w!\-.*'(),]+[/]){1,}$/;
        const list = await s3.listObjectsV2({ Bucket: bucketName }).promise();
        const filtered = list.Contents
            .filter((file) => folderTest.exec(file.Key))
            .map(data => ({
                key: data.Key,
                text: `/${data.Key}`,
                value: data.Key
            }));
        return filtered;
    } catch (error) {
        console.log(error);

    }
};

export const upload = async ({ accessKeyId, secretAccessKey, region, bucketName }, file, s3Path, tags) => {
    return (async function () {
        try {
            const s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                region,
                signatureVersion: 'v4'
            });
            const params = {
                Bucket: bucketName,
                Key: s3Path,
                Body: file,
                Tagging: tags ? tags : ''
            };
            return s3.upload(params).promise();
        } catch (e) {
            console.log('My error', e);
        }
    })();
}