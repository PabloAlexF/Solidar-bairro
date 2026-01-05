function Step7({ formData, updateData }: { formData: FormData; updateData: (data: Partial<FormData>) => void }) {
  return (
    <div className="max-w-[1400px] mx-auto">
      
      {/* Header da página de revisão */}
      <div className="text-center mb-16">
        <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Pronto para Publicar!</h2>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
          Revise todas as informações antes de publicar seu pedido na comunidade.
        </p>
      </div>

      {/* Container principal com layout inspirado no CSS */}
      <div className="bg-white rounded-[40px] border border-zinc-100 shadow-lg overflow-hidden">
        
        {/* Seção de informações principais */}
        <div className="p-12 border-b border-zinc-100">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Coluna esquerda - Informações básicas */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  Informações do Pedido
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  {/* Card de Categoria */}
                  <div className="bg-zinc-50 min-w-[200px] h-[75px] border-2 border-zinc-200 rounded-[24px] flex items-center justify-center transition-all hover:border-orange-300">
                    <p className="font-bold text-zinc-900 uppercase tracking-[0.2em] text-lg">
                      {formData.category}
                    </p>
                  </div>

                  {/* Card de Urgência */}
                  <div className="bg-zinc-50 min-w-[150px] h-[75px] border-2 border-zinc-200 rounded-[24px] flex items-center justify-center transition-all hover:border-orange-300">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full",
                        formData.urgency === 'urgente' ? "bg-red-500" : 
                        formData.urgency === 'moderada' ? "bg-orange-500" : "bg-blue-500"
                      )} />
                      <p className="font-bold text-zinc-600 uppercase tracking-widest text-sm">
                        {formData.urgency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itens solicitados (se for alimentos) */}
              {formData.category === "Alimentos" && formData.foodTypes.length > 0 && (
                <div className="pt-8 border-t border-zinc-100">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                    Itens Solicitados
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {formData.foodTypes.map(item => (
                      <span 
                        key={item} 
                        className="px-6 py-3 bg-orange-50 border border-orange-200 rounded-full font-bold text-orange-700 text-sm transition-all hover:bg-orange-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Coluna direita - Mensagem */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Sua Mensagem
              </h3>
              <div className="relative">
                <div className="bg-zinc-50 border-2 border-zinc-200 rounded-[32px] p-8 min-h-[200px] transition-all hover:border-orange-300">
                  <p className="text-zinc-700 text-lg leading-relaxed font-medium italic">
                    "{formData.description}"
                  </p>
                </div>
                <div className="absolute top-6 right-6 text-zinc-300">
                  <MessageSquare className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de detalhes de contato e visibilidade */}
        <div className="p-12">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Card de Contato */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-[32px] border-2 border-orange-200 transition-all hover:shadow-lg hover:border-orange-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">
                    Contato Preferencial
                  </p>
                  <p className="font-bold text-orange-900 text-lg">
                    {formData.contactPreferences.length > 0 
                      ? formData.contactPreferences.join(", ") 
                      : "Não definido"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card de Visibilidade */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-[32px] border-2 border-blue-200 transition-all hover:shadow-lg hover:border-blue-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                    Alcance do Pedido
                  </p>
                  <p className="font-bold text-blue-900 text-lg">
                    {formData.visibility.length > 0 
                      ? formData.visibility.join(", ") 
                      : "Não definido"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner de confirmação */}
          <div className="mt-12 bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-[32px] text-white shadow-xl">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Tudo pronto!</h3>
                <p className="text-green-100 text-lg font-medium">
                  Seu pedido será publicado na rede de apoio comunitário e vizinhos próximos poderão te ajudar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}