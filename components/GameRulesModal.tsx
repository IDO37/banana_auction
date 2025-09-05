'use client';

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameRulesModal({ isOpen, onClose }: GameRulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🍌 바나나 경매 게임 규칙
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* 게임 규칙 내용 */}
          <div className="space-y-6 text-gray-700">
            <div className="bg-banana-50 border border-banana-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-banana-800 mb-3">🎯 게임 목표</h3>
              <p>인당 10개의 바나나로 시작하여 <strong>목표 바나나 개수</strong>를 먼저 채우는 사람이 승리합니다.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-blue-800 mb-3">🏆 경매 매물</h3>
              <p>경매 매물로 올라오는 바나나의 금액은 <strong>최고금액을 소지하고 있는 사람의 바나나 수</strong>와 같습니다.</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-green-800 mb-3">💰 경매 규칙</h3>
              <ul className="space-y-2">
                <li>• 가장 높은 호가를 제시한 사람이 바나나를 가져갑니다</li>
                <li>• 가장 높은 호가에서 두 번째로 높은 호가를 뺀 금액만큼 두 번째 호가를 제시한 사람이 바나나를 가져갑니다</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-yellow-800 mb-3">📝 예시</h3>
              <div className="bg-white rounded p-3 border">
                <p><strong>A바나나</strong> - 10개</p>
                <p><strong>B바나나</strong> - 10개</p>
                <br />
                <p><strong>A호가</strong> 26</p>
                <p><strong>B호가</strong> 20</p>
                <br />
                <p>26 - 20 = 6</p>
                <p><strong>B가 6의 바나나를 가져가고, A는 4의 바나나를 가져갑니다.</strong></p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-red-800 mb-3">⚠️ 파산 규칙</h3>
              <ul className="space-y-2">
                <li>• 두 번째로 높은 호가를 제시한 사람에게 나눠줘야 할 금액이 매물의 바나나 금액을 넘어선다면, 첫 번째 사람의 지갑에서 합산하여 지불해야 합니다</li>
                <li>• 그 금액 또한 모자라다면 파산합니다</li>
                <li>• <strong>파산해도 입찰은 가능</strong>하니, 목표치를 채우기 위해 노력하세요!</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <h3 className="font-bold text-lg text-purple-800 mb-2">🎉 승리 조건</h3>
              <p className="text-lg">과연 누가 바나나를 독차지 하게 될까요??!</p>
              <p className="text-sm text-gray-600 mt-2">행운을 빕니다 :)</p>
            </div>
          </div>

          {/* 닫기 버튼 */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-banana-500 hover:bg-banana-600 text-white font-bold rounded-md transition duration-200"
            >
              게임 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
