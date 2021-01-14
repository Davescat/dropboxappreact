import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import CSVReader from 'react-csv-reader'

export const CSVForm = ({
    uploadCsvInput,
    s3List,
    handleMoveChange,
    moveData,
    credentialsValid,

}) => {
    const [csv, setCsv] = useState(null)
    const [url, setUrl] = useState('')
    const [tagKeys, setTagKeys] = useState([])

    //Courtesy of answer in https://stackoverflow.com/questions/44429173/javascript-encodeuri-failed-to-encode-round-bracket
    const superEncodeURI = (url) => {
        var encodedStr = '', encodeChars = ["(", ")"];
        url = encodeURIComponent(url);

        for (var i = 0, len = url.length; i < len; i++) {
            if (encodeChars.indexOf(url[i]) >= 0) {
                var hex = parseInt(url.charCodeAt(i)).toString(16);
                encodedStr += '%' + hex;
            }
            else {
                encodedStr += url[i];
            }
        }

        return encodedStr;
    }

    const parseInput = () => {
        const list = csv.map((row) => ({
            url: row[url],
            tagset: tagKeys.reduce((val, tag, i) => {
                return `${val ? val : ''}${i === 0 ? '' : '&'}${superEncodeURI(tag)}=${superEncodeURI(row[tag] ? row[tag] : '')}`
            }, '')
        })
        );
        return list
    }

    return (
        <Form className='flex-form'>
            <CSVReader disabled={!credentialsValid} cssClass='field' label='Csv for Multi-Upload' cssInputClass='ui button' parserOptions={{ header: true }} onFileLoaded={setCsv} />
            <Form.Select
                disabled={!credentialsValid || !csv}
                required={moveData.s3Path === ''}
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
            <Form.Select
                disabled={!credentialsValid || !csv}
                label={'Column used for Dropbox Url'}
                onChange={(event, data) => setUrl(data.value)}
                options={csv ? Object.keys(csv[0]).map(key => ({ text: key, value: key })) : []}
            />
            <Form.Select
                label={'Column(s) to be included for tagging'}
                multiple
                disabled={!credentialsValid || !csv}
                onChange={(event, data) => setTagKeys(data.value)}
                options={csv ? Object.keys(csv[0]).map(key => ({ text: key, value: key })) : []}
            />
            <Form.Button
                disabled={!credentialsValid || !csv}
                onClick={() => uploadCsvInput(parseInput())}
                children={'Upload list'}
            />
        </Form>
    )
}
