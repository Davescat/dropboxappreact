import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import CSVReader from 'react-csv-reader'

export const CSVForm = ({
    uploadCsvInput,
    s3List,
    handleMoveChange,
    moveData,
    credentialsValid,
    setError

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

    const validateInput = () => {
        const reggy = /^[^\s][\w\d\-+=._:\/@ ]*[^\s]$/;
        const errorList = csv.reduce((prev, row, i) => {
            if (!(tagKeys.every((value) => row[value] === '' ? true : reggy.test(row[value].trim()))
            )) {
                prev.push(<div><b>Line {i + 2}:</b> Error with following tag(s): {(tagKeys.filter((value) => row[value] === '' ? false : !reggy.test(row[value].trim())))}</div>)
            }
            return prev
        }, [])
        if (errorList && errorList.length > 0) {
            errorList.push(<div>Please make sure each tag value has no spaces before or after and only include letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.</div>)
            setError(errorList);
        } else {
            setError([]);
            uploadCsvInput(parseInput());
        }
    }

    const parseInput = () => {
        const list = csv.map((row) => ({
            url: row[url],
            tagset: tagKeys.reduce((val, tag, i) => {
                return `${val ? val : ''}${i === 0 ? '' : '&'}${superEncodeURI(tag)}=${superEncodeURI(row[tag] ? row[tag].trim() : '')}`
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
                onClick={() => (validateInput())}
                children={'Upload list'}
            />
        </Form>
    )
}
