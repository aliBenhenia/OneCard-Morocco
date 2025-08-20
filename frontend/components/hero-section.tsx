import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 py-16 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Never run out</h1>
          <h1 className="text-5xl font-bold text-gray-800 mb-2">again!</h1>
          <p className="text-2xl text-gray-800 mb-1">Top up your</p>
          <p className="text-2xl text-gray-800 mb-1">balance data in</p>
          <p className="text-2xl font-semibold text-gray-800 mb-8">seconds</p>

          <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 text-lg rounded-full">
            Recharge now
          </Button>
        </div>

        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative">
            {/* STC Card */}
            <div className="w-32 h-20 bg-purple-800 rounded-lg transform rotate-12 shadow-xl absolute -top-4 -left-8 flex items-center justify-center">
              <span className="text-white font-bold">STC</span>
            </div>

            {/* Blue Card */}
            <div className="w-32 h-20 bg-blue-500 rounded-lg transform -rotate-6 shadow-xl absolute top-0 right-0 flex items-center justify-center">
              <span className="text-white font-bold">💳</span>
            </div>

            {/* Black Card */}
            <div className="w-32 h-20 bg-gray-900 rounded-lg transform rotate-3 shadow-xl relative flex items-center justify-center">
              <span className="text-white font-bold">CARD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
