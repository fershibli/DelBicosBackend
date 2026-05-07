"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Config_1 = require("../config/s3Config");
class S3Service {
    constructor() {
        this.bucketName = process.env.S3_BUCKET_NAME;
    }
    listFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const command = new client_s3_1.ListObjectsV2Command({
                Bucket: this.bucketName,
            });
            const response = yield s3Config_1.s3Client.send(command);
            return ((_a = response.Contents) === null || _a === void 0 ? void 0 : _a.map(file => ({
                name: file.Key,
                size: file.Size,
                lastModified: file.LastModified
            }))) || [];
        });
    }
    getFileUrl(fileKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Config_1.s3Client, command, { expiresIn: 3600 });
            return url;
        });
    }
    generateUploadUrl(fileName, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                ContentType: fileType,
            });
            return yield (0, s3_request_presigner_1.getSignedUrl)(s3Config_1.s3Client, command, { expiresIn: 300 });
        });
    }
}
exports.S3Service = S3Service;
