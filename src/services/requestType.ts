export interface UploadExcelTemplateRequest {
    file: File
    userId:"string"
    instruction:"string"
}
export interface UploadExcelTemplateResponse {
    template_id: string
    message: string
  }