interface BookCardProps {
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  description?: string;
}

export default function BookCard({ 
  title, 
  author, 
  category, 
  coverImage,
  description 
}: BookCardProps) {
  return (
    <div className="bg-[#1a120a] rounded-lg overflow-hidden border border-[#4a3620] hover:border-[#c9a961] transition-all hover:transform hover:scale-105 duration-300 cursor-pointer">
      {/* Imagem da capa */}
      <div className="h-64 bg-[#2d1f0e] flex items-center justify-center relative overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl">📖</div>
        )}
        <div className="absolute top-2 right-2 bg-[#c9a961] text-[#1a1108] px-3 py-1 rounded-full text-sm font-semibold">
          {category}
        </div>
      </div>

      {/* Informações do livro */}
      <div className="p-4">
        <h3 className="text-[#c9a961] font-bold text-lg mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-[#8b6f47] text-sm mb-3">
          por {author}
        </p>
        {description && (
          <p className="text-[#e8dcc8] text-sm line-clamp-3 mb-4">
            {description}
          </p>
        )}
        <div className="flex gap-2">
          <button className="flex-1 bg-[#8b6f47] text-[#e8dcc8] py-2 px-4 rounded-lg hover:bg-[#c9a961] hover:text-[#1a1108] transition-all font-medium">
            Ler
          </button>
          <button className="bg-[#4a3620] text-[#c9a961] py-2 px-4 rounded-lg hover:bg-[#8b6f47] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
