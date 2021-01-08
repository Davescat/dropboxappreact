import { Dropbox } from 'dropbox'
const fetch = window.fetch.bind(window);


export const isUserValid = async (accessToken) => {
    const dp = new Dropbox({ fetch: fetch, accessToken: accessToken, clientId: process.env.REACT_APP_DP_APPKEY, clientSecret: process.env.REACT_APP_DP_SECRETKEY });
    const result = await dp.checkUser({ query: 'IsValid' })
    return result.status === 200 ? true : false;
}

export const getDropboxFolderList = async (accessToken) => {
    const dp = new Dropbox({ fetch: fetch, accessToken: accessToken, clientId: process.env.REACT_APP_DP_APPKEY, clientSecret: process.env.REACT_APP_DP_SECRETKEY });
    const list = await dp.filesListFolder({ path: '', recursive: true });
    if (list.result && list.result.entries) {
        return list.result.entries.filter(file => file[".tag"] === 'folder').map(data => ({
            key: data.path_lower,
            text: `${data.path_display}/`,
            value: data.path_lower
        }))
    }
}

export const getDropboxFilesInFolder = async (accessToken, path) => {
    const dp = new Dropbox({ fetch: fetch, accessToken: accessToken, clientId: process.env.REACT_APP_DP_APPKEY, clientSecret: process.env.REACT_APP_DP_SECRETKEY });
    const list = await dp.filesListFolder({ path: path, recursive: false })
    return list.result.entries.filter(file => file[".tag"] === 'file');

}


export const downloadFromLink = (accessToken, link) => {
    const dp = new Dropbox({ fetch: fetch, accessToken: accessToken, clientId: process.env.REACT_APP_DP_APPKEY, clientSecret: process.env.REACT_APP_DP_SECRETKEY });
    return dp.sharingGetSharedLinkFile({ url: link })
}

export const downloadFromPath = (accessToken, path) => {
    const dp = new Dropbox({ fetch: fetch, accessToken: accessToken, clientId: process.env.REACT_APP_DP_APPKEY, clientSecret: process.env.REACT_APP_DP_SECRETKEY });
    return dp.filesDownload({ path: path });
}
