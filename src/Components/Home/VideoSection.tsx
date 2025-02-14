import { Play, ArrowDown } from 'lucide-react'
import { Button } from '../ui/button'
import { styles } from '../../constants/styles'
import img from '../../assets/videoI.png'

export function VideoSection() {
  return (
    <section className="w-full bg-white">
      <div className={styles.section.container}>
        <div className="flex flex-col items-center space-y-8 py-12">
          <div className="w-full relative rounded-[2rem] overflow-hidden aspect-[16/8]">
            <img
              src={img}
              alt="Scenic mountain landscape of Plateau"
              className="w-full h-full object-cover"
            />
            <button 
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Play video"
            >
              <div className="rounded-full bg-white/90 p-8 transition-transform group-hover:scale-110">
                <Play className="w-10 h-10 text-[#4D7C0F]" />
              </div>
            </button>
          </div>

          <Button 
            className="bg-[#4D7C0F] font-medium hover:bg-[#3F6A0A] text-white px-16 py-6 rounded-full text-lg text-base md:text-md leading-relaxed"
          >
            Start your journey
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

