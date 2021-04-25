import { FileInfo, FileType } from './types'

export function paginate(
  files: any[],
  page: number,
  resultsLimit: number
) {
  const start = page * resultsLimit - resultsLimit
  const end = start + resultsLimit
  const pageResults = files.slice(start, end)
  return pageResults
}

export function getSanitizedFileName(fileName: string) {
  return fileName.split(' ').join('_')
}

export function getFileInfo(fileName: string): FileInfo {
  const suffix = fileName
    .split('.')
    .slice(-1)[0]
    .toLowerCase()
  switch (suffix) {
    case 'png':
      return {
        type: 'Image',
        contentType: 'image/png',
        s3UploadFolder: 'images'
      }
    case 'jpg':
    case 'jpeg':
      return {
        type: 'Image',
        contentType: 'image/jpeg',
        s3UploadFolder: 'images'
      }
      case 'mov':
        return {
          type: 'Video',
          contentType: 'video/quicktime',
          s3UploadFolder: 'videos'
        }
      case 'mp4':
        return {
          type: 'Video',
          contentType: 'video/mp4',
          s3UploadFolder: 'videos'
        }
      case 'wmv':
        return {
          type: 'Video',
          contentType: 'video/x-ms-asf',
          s3UploadFolder: 'videos'
        }
      case 'flv':
        return {
          type: 'Video',
          contentType: 'video/x-flv',
          s3UploadFolder: 'videos'
        }
      case 'avi':
        return {
          type: 'Video',
          contentType: 'video/x-msvideo',
          s3UploadFolder: 'videos'
        }
    case 'pdf':
      return {
        type: 'PDF',
        contentType: 'application/pdf',
        s3UploadFolder: 'pdfs'
      }
    case 'doc':
      return {
        type: 'Word Document',
        contentType: 'application/msword',
        s3UploadFolder: 'docs'
      }
    case 'docx':
      return {
        type: 'Word Document',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        s3UploadFolder: 'docs'
      }
    case 'xls':
      return {
        type: 'Spreadsheet',
        contentType: 'application/vnd.ms-excel',
        s3UploadFolder: 'spreadsheets'
      }
    case 'xlsx':
      return {
        type: 'Spreadsheet',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        s3UploadFolder: 'spreadsheets'
      }
    case 'csv':
      return {
        type: 'Spreadsheet',
        contentType: 'text/csv',
        s3UploadFolder: 'spreadsheets'
      }
    case 'ppt':
      return {
        type: 'PowerPoint',
        contentType: 'application/vnd.ms-powerpoint',
        s3UploadFolder: 'powerpoints'
      }
    case 'pptx':
      return {
        type: 'PowerPoint',
        contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        s3UploadFolder: 'powerpoints'
      }
    default:
      return {
        type: 'File',
        contentType: 'text',
        s3UploadFolder: 'other-files'
      }
  }
}

export function getFileThumbnail(fileUrl: string, fileType: FileType, serverUrl: string) {
  switch (fileType) {
    case 'Image':
      return `${fileUrl}@80w_80h`
    case 'Video':
      return `${serverUrl}/icons/file-video.svg`
    case 'PDF':
      return `${serverUrl}/icons/file-pdf.svg`
    case 'Word Document':
      return `${serverUrl}/icons/file-word.svg`
    case 'Spreadsheet':
      return `${serverUrl}/icons/file-excel.svg`
    case 'PowerPoint':
      return `${serverUrl}/icons/file-powerpoint.svg`
    default:
      return `${serverUrl}/images/file-image.svg`
  }
}

// used in forms endpoints
export function camelCaseToTitle(camelString: string) {
  // convert camelCase to separate words
  const spaced = camelString.replace(/([a-zA-Z])(?=[A-Z])/g, '$1 ')
  // capitalize first letter of each word
  const title = spaced
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  return title
}

// used in send-to-algolia endpoint
export function snakeCaseToTitle(snakeString: string) {
  // convert camelCase to separate words
  const spaced = snakeString.replace('_', ' ')
  // capitalize first letter of each word
  const title = spaced
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  return title
}
