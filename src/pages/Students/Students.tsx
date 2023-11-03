import { useMutation, useQuery, useQueryClient } from 'react-query'
import { deleteStudent, getStudentById, getStudents } from 'api/student'
import { Link } from 'react-router-dom'
import { useQueryString } from 'utils/utils'
import { toast } from 'react-toastify'
const LIMIT = 10
export default function Students() {
  const queryString: {
    page?: string
  } = useQueryString()
  const page = Number(queryString?.page) || 1
  //use signal react query to cancel call api with axios
  const studentQuery = useQuery(
    ['student', page],
    ({ signal }) => {
      //cancel after 5 second
      // const controller = new AbortController()
      // setTimeout(() => controller.abort, 5000)
      // return getStudents(page, LIMIT, controller.signal)

      return getStudents(page, LIMIT, signal)
    },
    {
      // cacheTime: 1000 * 5 * 60, default 5 minutes
      // retry: 0, //try fetch 0 time
      staleTime: 1000 * 60,
      keepPreviousData: true
    }
  )
  const queryClient = useQueryClient()

  const deleteStudentMutation = useMutation((id: number | string) => deleteStudent(id), {
    onSuccess: () => {
      toast.success('Delete success!')
      queryClient.invalidateQueries(['student', page], { exact: true })
    }
  })
  const handleDelete = (id: number) => {
    deleteStudentMutation.mutate(id)
  }
  const handleHoverStudent = (id: number) => {
    queryClient.prefetchQuery(['student', id], () => getStudentById(id), {
      staleTime: 1000 * 10
    })
    // console.log();
  }
  const refetchStudent = () => {
    studentQuery.refetch()
  }
  const cancelRefetchStudent = () => {
    queryClient.cancelQueries(['student', page])
  }
  const totalStudent = Number(studentQuery.data?.headers['x-total-count']) || 0
  const totalPage = Math.ceil(totalStudent / LIMIT)
  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div className='mt-2'>
        <Link
          type='button'
          className='mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300'
          to={`/students/add`}
        >
          Add student
        </Link>
        <button onClick={refetchStudent}>Refresh student</button>
      </div>
      {studentQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!studentQuery.isLoading && (
        <>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentQuery.data?.data.map((student) => (
                  <tr
                    key={student.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                    onMouseEnter={() => handleHoverStudent(student.id)}
                  >
                    <td className='py-4 px-6'>{student.id}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <td className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </td>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        className='font-medium text-red-600 dark:text-red-500'
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  <Link
                    className={`${
                      page === 1 && 'cursor-not-allowed'
                    } rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    to={`/students?page=${page > 1 ? page - 1 : page}`}
                  >
                    Previous
                  </Link>
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => (
                    <li key={index + 1}>
                      <Link
                        className={`${
                          page === index + 1 ? 'bg-gray-700' : ''
                        } border border-gray-300 bg-white py-2 px-3 leading-tight  text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
                        to={`/students?page=${index + 1}`}
                      >
                        {index + 1}
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link
                    className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    to={`/students?page=${page < totalPage ? page + 1 : page}`}
                  >
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
