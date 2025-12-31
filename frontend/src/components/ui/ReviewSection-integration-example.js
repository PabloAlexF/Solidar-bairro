// Exemplo de como integrar o componente ReviewSection no PrecisoDeAjuda.js

// No início do arquivo, adicionar o import:
import ReviewSection from '../components/ui/ReviewSection';

// Substituir a seção de revisão existente (step final) por:

{step === totalSteps && (
  <div className="animate-fade-in-up">
    <ReviewSection
      formData={formData}
      categories={categories}
      urgencyLevels={urgencyLevels}
      contactMethods={contactMethods}
      visibilityOptions={visibilityOptions}
      clothingTypes={clothingTypes}
      foodTypes={foodTypes}
      hygieneTypes={hygieneTypes}
      medicineTypes={medicineTypes}
      billTypes={billTypes}
      workTypes={workTypes}
      clothingSizes={clothingSizes}
      onAnonymousToggle={() => setFormData({ ...formData, anonymous: !formData.anonymous })}
      onPublish={handlePublish}
      isSubmitting={isSubmitting}
    />
  </div>
)}

// Remover o botão "Publicar Pedido" do footer quando estiver no step final,
// pois agora ele está integrado no componente ReviewSection

// No footer, modificar a condição:
<div className="p-6 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
  <button
    onClick={prevStep}
    disabled={step === 1}
    className="rounded-xl px-6 py-3 h-auto text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all duration-300 flex items-center gap-2 hover:scale-105 border border-slate-200"
  >
    <svg className="w-5 h-5 transition-transform duration-300 hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    Voltar
  </button>
  
  {/* Só mostrar o botão Continuar se não estiver no step final */}
  {step < totalSteps && (
    <button
      onClick={nextStep}
      disabled={!isStepValid()}
      className="rounded-xl px-8 py-3 h-auto text-lg font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white"
    >
      Continuar
      <svg className="w-5 h-5 transition-transform duration-300 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )}
</div>