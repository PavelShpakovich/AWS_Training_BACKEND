// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "import-service",
    "version": "1"
  },
  "paths": {
    "/import": {
      "get": {
        "summary": "importProductsFile",
        "description": "",
        "operationId": "importProductsFile.get.import",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "name",
            "type": "string",
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/SignedUrl"
            }
          },
          "400": {
            "description": "Validation error",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          },
          "500": {
            "description": "Server Error",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "SignedUrl": {
      "properties": {
        "url": {
          "title": "SignedUrl.url",
          "type": "string"
        }
      },
      "required": [
        "url"
      ],
      "additionalProperties": false,
      "title": "SignedUrl",
      "type": "object"
    },
    "ErrorResponse": {
      "properties": {
        "message": {
          "title": "ErrorResponse.message",
          "type": "string"
        }
      },
      "required": [
        "message"
      ],
      "additionalProperties": false,
      "title": "ErrorResponse",
      "type": "object"
    }
  },
  "securityDefinitions": {},
  "basePath": "/dev",
  "schemes": [
    "https"
  ]
};