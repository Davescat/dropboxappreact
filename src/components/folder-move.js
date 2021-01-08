import React from 'react';
import { Form } from 'semantic-ui-react';


export const FolderMove = ({
    moveData,
    handleMoveChange,
    moveFolder,
    s3List,
    dropboxList,
    credentialsValid
}) => {


    return (
        <Form className='flex-form'>
            <Form.Select
                disabled={!credentialsValid}
                required={moveData.dropboxPath ===''}
                id="dropbox-path"
                options={dropboxList ? dropboxList : []}
                name="dropboxPath"
                label="DropBox Folder to Copy"
                placeholder="/folder-to-copy"
                search
                loading={!dropboxList}
                value={moveData.dropboxPath}
                onChange={handleMoveChange}
            />

            <Form.Select
                disabled={!credentialsValid}
                required={moveData.s3Path ===''}
                options={s3List ? s3List : []}
                loading={!s3List}
                search
                id="s3-path"
                name="s3Path"
                label="S3 Destination Folder"
                placeholder="/foo/destination"
                value={moveData.s3Path}
                onChange={handleMoveChange}
            />
            <Form.Button
                disabled={!credentialsValid}
                onClick={() => moveFolder()}>Move Folder</Form.Button>
        </Form>
    )
}

