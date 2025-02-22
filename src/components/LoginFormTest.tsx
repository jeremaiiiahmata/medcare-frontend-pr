import React from 'react'

const LoginFormTest = () => {
  return (
    <>
      <div className="flex fle-col items-center justify-center bg-white rounded-2xl shadow-lg">
        <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl max-lg:max-w-lg w-full">
          <form className="lg:max-w-md w-full">
            <div className='ml-6 mt-6 mb-6'>
            <h3 className="text-gray-800 text-2xl font-bold mb-8">Create an account</h3>
            <div className="space-y-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block font-semibold">Username</label>
                <input name="name" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 focus:bg-transparent border border-gray-100 focus:border-black outline-none transition-all" placeholder="Enter name" />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block font-semibold">Email</label>
                <input name="email" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 focus:bg-transparent border border-gray-100 focus:border-black outline-none transition-all" placeholder="Enter email" />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block font-semibold">Password</label>
                <input name="password" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 focus:bg-transparent border border-gray-100 focus:border-black outline-none transition-all" placeholder="Enter password" />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block font-semibold">Confirm Password</label>
                <input name="password" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 focus:bg-transparent border border-gray-100 focus:border-black outline-none transition-all" placeholder="Enter password" />
              </div>
            </div>

            <div className="mt-6">
              <button type="button" className="py-3 px-6 text-sm text-white tracking-wide bg-[#03624C] hover:bg-[#042222] focus:outline-none rounded-md">
                Register
              </button>
            </div>
            <p className="text-sm text-gray-800 mt-6">Already have an account? <a href="javascript:void(0);" className="text-[#03624C] font-semibold hover:underline ml-1">Login here</a></p>
            </div>
          </form>

          <div className="h-full">
            <img src="/logo-placeholder.png" className="w-full h-full rounded-2xl" alt="login img" />
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginFormTest