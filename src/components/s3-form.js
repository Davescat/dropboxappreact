import React from 'react';
import { regions } from './regions'
import { Button, Form, Icon } from 'semantic-ui-react';
import { testConnectionS3Bucket } from './utils/s3-utils';

export const S3Form = ({ formData, handleFieldChange, s3Validated, setS3Validated }) => {
    const validate = async () => {
        testConnectionS3Bucket(formData).then(value => {
            if (value) {
                if (formData.rememberMe) {
                    localStorage.bucketName = formData.bucketName;
                    localStorage.accessKeyId = formData.accessKeyId;
                    localStorage.secretAccessKey = formData.secretAccessKey;
                    localStorage.selectedRegion = formData.selectedRegion;
                } else {
                    localStorage.bucketName = '';
                    localStorage.accessKeyId = '';
                    localStorage.secretAccessKey = '';
                    localStorage.selectedRegion = '';
                }
                localStorage.rememberMe = formData.rememberMe;
                setS3Validated(value);

            }
        }
        );
    }

    return (formData ? <Form
        className="s3-form"
    >
        <Form.Input
            required={formData.bucketName === ''}
            id="form-input-s3-bucket-name"
            name="bucketName"
            label="S3 Bucket Name"
            placeholder="my-really-cool-s3-bucket-name"
            value={formData.bucketName}
            onChange={handleFieldChange}
        />
        <Form.Input
            required={formData.accessKeyId === ''}
            id="form-control-access-key-id"
            name="accessKeyId"
            label="Access Key ID"
            placeholder="12345ABCDEFG"
            value={formData.accessKeyId}
            type="password"
            onChange={handleFieldChange}
        />
        <Form.Input
            required={formData.secretAccessKey === ''}
            id="form-control-secret-access-key-id"
            name="secretAccessKey"
            label="Secret Access Key"
            placeholder="12345ABCDEFG/B123232"
            value={formData.secretAccessKey}
            type="password"
            onChange={handleFieldChange}
        />
        <Form.Select
            required={formData.region === ''}
            name="region"
            value={formData.region}
            options={regions}
            label={{
                children: 'Region',
                htmlFor: 'form-select-control-region'
            }}
            placeholder="Region"
            search
            searchInput={{
                id: 'form-select-control-region'
            }}
            onChange={handleFieldChange}
        />
        <Form.Checkbox
            label="Remember me"
            checked={formData.rememberMe}
            onChange={() => {
                handleFieldChange(null, { name: 'rememberMe', value: !formData.rememberMe });   
            }}
        />
        <Button onClick={() => validate()}>Validate S3 bucket</Button> <Icon className='approve-icon' name={s3Validated ? 'check' : 'x'} color={s3Validated ? 'green' : 'red'} />
    </Form> : <div>hey</div>)
}