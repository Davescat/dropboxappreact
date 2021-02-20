import React, { useEffect, useState } from 'react';
import { CSVForm } from './csv-form';
import { Grid, Message, Progress } from 'semantic-ui-react';
import { downloadFromLink, downloadFromPath, getDropboxFilesInFolder, getDropboxFolderList } from './utils/dropbox-utils';
import { upload, getS3FolderList } from './utils/s3-utils';
import { FolderMove } from './folder-move';

const { log } = console

export const FilesMover = ({ formData, moveData, handleMoveChange, credentialsValid }) => {
    const [progress, setProgress] = useState(null);
    const [progressActive, setProgressActive] = useState(false)
    const [s3List, setS3List] = useState(null);
    const [dropboxList, setDropboxList] = useState(null);
    const [error, setError] = useState([])

    useEffect(() => {
        if (!s3List) {
            getS3FolderList(formData).then(setS3List)
        }
        if (!dropboxList) {
            getDropboxFolderList(formData.dropboxAccessKey).then(setDropboxList);
        }
    }, [s3List, dropboxList])

    const moveFolder = async () => {
        getDropboxFilesInFolder(formData.dropboxAccessKey, moveData.dropboxPath).then(fileList => {
            setProgressActive(true)
            setProgress(0);
            let counter = 0;
            fileList.forEach(async (data) => {
                const fileData = await downloadFromPath(formData.dropboxAccessKey, data.path_lower);
                const { fileBlob, name } = fileData.result;
                const results = await upload(formData, fileBlob, `${moveData.s3Path}${name}`)
                if (results && results.Key) {
                    counter++;
                    setProgress(Math.floor(((counter) / fileList.length) * 100))
                    if (Math.floor(((counter) / fileList.length) * 100) === 100) {
                        setProgressActive(false)
                    }
                } else {
                    throw new Error(name, "Error while uploading to S3")

                }
            })
        })
    }

    const uploadCsvInput = async (data) => {
        setError([]);
        setProgressActive(true)
        setProgress(0);

        for (let index = 0; index < data.length; index++) {
            try {
                const fileData = await downloadFromLink(formData.dropboxAccessKey, data[index].url);
                const { fileBlob, name } = fileData.result;
                const results = await upload(formData, fileBlob, `${moveData.s3Path}${name}`, data[index].tagset)
                if (results && results.Key) {
                    log(`${(index + 1)} of ${data.length - 1}`)
                    setProgress(Math.floor(((index + 1) / (data.length - 1)) * 100))
                } else {
                    throw new Error("Error while uploading to S3")
                }
            } catch (e) {
                setError([...error, (<div><b>{data[index].url}</b> Something wrong upload!</div>)]);
                console.log(data[index], e);
            }
        }
        setProgressActive(false)
    }

    return (
        <Grid
            className='form-grid'>
            {error.length > 0 && (<Grid.Row>
                <Grid.Column>
                    <Message negative>
                        {error}
                    </Message>
                </Grid.Column>
            </Grid.Row>)}
            <Grid.Row
                className='form-row'>
                <Grid.Column
                    className='form-col'
                    tablet={'8'}
                    widescreen={'8'}
                    largeScreen={'8'}
                    computer={'8'}
                    mobile={'16'}
                >
                    <FolderMove
                        credentialsValid={credentialsValid}
                        s3List={s3List}
                        dropboxList={dropboxList}
                        handleMoveChange={handleMoveChange}
                        moveData={{ ...moveData }}
                        formData={{ ...formData }}
                        moveFolder={moveFolder}
                    />
                </Grid.Column>
                <Grid.Column
                    className='form-col'
                    tablet={'8'}
                    widescreen={'8'}
                    largeScreen={'8'}
                    computer={'8'}
                    mobile={'16'}
                >
                    <CSVForm
                        credentialsValid={credentialsValid}
                        uploadCsvInput={uploadCsvInput}
                        s3List={s3List}
                        handleMoveChange={handleMoveChange}
                        moveData={{ ...moveData }}
                        formData={{ ...formData }}
                        setError={setError}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column
                    width={16}>
                    <Progress active={progressActive} percent={progress === 0 ? '' : progress} color={"blue"} progress />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
