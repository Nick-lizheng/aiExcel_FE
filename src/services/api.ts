import axiosClient from "./apiClient";
import type { UploadExcelTemplateRequest, UploadExcelTemplateResponse } from "./requestType";



// 上传 Excel 模板接口
export const uploadExcelTemplate = async (
    data: UploadExcelTemplateRequest
): Promise<any> => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('userId', data.userId)
    formData.append('instruction', data.instruction)
    console.log(formData.values.toString());
    const response = await axiosClient.post<any>('/api/case/submit', formData)
    return response.data
}
//   generate
// file: file needed to upload
// userId:"string"
export const reGenerate = async (data: {
    file: File,
    template_id: string
}): Promise<any> => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('template_id', data.template_id)
    const response = await axiosClient.post<any>('/api/case/generate', formData)
    return response.data

}
//   statusUpdate
// 
// /
export const statusUpdate = async (data: {
    template_id: string, status: 'save' | 'delete'
}): Promise<any> => {
    const response = await axiosClient.post<any>('/api/case/status', data)
    return response.data

}

//   getTemplateList
export const getTemplateList = async (): Promise<any> => {
    const response = await axiosClient.post<any>('/api/case/list', {
        status : '1'
    })
    return response.data

}