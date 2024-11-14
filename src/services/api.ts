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
    console.log('-------data.file------');
    console.log(data);
    console.log('-------formData------');
    console.log(formData.values.toString());

    const response = await axiosClient.post<any>('/api/case/submit', formData)
    return response
  }