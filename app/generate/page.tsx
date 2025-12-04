import AIGenerator from '@/components/AIGenerator'

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">AI Course Generator</h1>
        <AIGenerator />
      </div>
    </div>
  )
}
