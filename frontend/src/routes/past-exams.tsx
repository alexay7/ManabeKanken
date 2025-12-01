import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useExamStore} from "@/stores/exam-store.ts";
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute('/past-exams')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate=useNavigate({from:Route.fullPath})

  const {pastResults,resetExam}=useExamStore()

  return (
      <div className="flex justify-center items-center h-[calc(100vh-9rem)] w-full">
        <div className="flex flex-col gap-2 w-[50%]">
          <div className="flex flex-col gap-4 bg-dark mx-auto bg-gray-200 p-4 rounded-lg select-none text-black w-full">
            <p className='text-xl font-semibold'>過去の試験結果</p>

            <ul className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {pastResults.length === 0 && (
                  <li className="text-center text-gray-500">過去の試験結果がありません。</li>
              )}
              {pastResults.map((result, index) => (
                  <li key={index} className="border border-gray-300 rounded p-2 bg-white">
                    <button onClick={() => {
                      resetExam();
                      return navigate({to: `/${result.level}`,search:{result:result.timestamp}})
                    }} className="w-full text-left">
                      <p><strong>日付:</strong> {new Date(result.timestamp).toLocaleDateString("ja",{day:"2-digit",month:"long",year:"numeric"})}</p>
                      <p><strong>試験レベル:</strong> {result.level}級</p>
                      <p><strong>点数:</strong> {result.score}点</p>
                      <p><strong>結果:</strong> {result.passed ? '合格' : '不合格'}</p>
                    </button>
                  </li>
              ))}
            </ul>
          </div>

          <Button className="mt-4 w-full" onClick={() => {
            void navigate({to: '/'})
          }}>
            ホームに戻る
          </Button>
        </div>
      </div>
  )
}
