import { IoIosChatbubbles } from "react-icons/io";

export default function Main() {
  return (  
    <main className='w-full flex flex-col justify-center items-center gap-4 p-10 text-gray-700 text-xl  font-semibold bg-gray-100 shadow-md rounded-lg'>
        <div className="text-justify [text-align-last:center]">Open any chat to start conservation</div>
        <IoIosChatbubbles/>
    </main>
  );
}