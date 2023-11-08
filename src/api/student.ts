import { IStudent, IStudents } from 'interfaces/student'
import { studentHttp } from 'utils/studentHttp'

export const getStudents = (page: number | string, limit: number | string) =>
  studentHttp.get<IStudents>('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })
export const addStudent = (student: Omit<IStudent, 'id'>) => studentHttp.post<IStudent>('students', student)
export const getStudentById = (id: number | string) => studentHttp.get<IStudent>(`students/${id}`)
export const updateStudent = (id: number | string, student: IStudent) =>
  studentHttp.put<IStudent>(`students/${id}`, student)
export const deleteStudent = (id: number | string) => studentHttp.delete<{}>(`students/${id}`)
