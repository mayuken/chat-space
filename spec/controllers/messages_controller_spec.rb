require 'rails_helper'

describe MessagesController do
#  letを利用してテスト中使用するインスタンスを定義
  let(:group) { create(:group) }
  let(:user) { create(:user) }
  # indexアクションで
  describe '#index' do 
        # ログインしている時
    context 'log in' do
      before do
        login user
        get :index, params: { group_id: group.id }
      end

      it 'assigns @message' do
        expect(assigns(:message)).to be_a_new(Message)
      end

      it 'assigns @group' do
        expect(assigns(:group)).to eq group
      end

      it 'renders index' do
        expect(response).to render_template :index
      end
    end
        # ログインしていない時
    context 'not log in' do
      before do
        get :index, params: { group_id: group.id }
      end

      it 'redirects to new_user_session_path' do
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe '#create' do
      let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }
      # ログインしている
    context 'log in' do
      before do
        login user
      end
        # かつ保存に成功している
      context 'can save' do
        subject {
          post :create,
          params: params
        }
          
        it 'count up message' do  # メッセージの保存はできたのか
          expect{ subject }.to change(Message, :count).by(1)
        end
          
        it 'redirects to group_messages_path' do  # 意図した画面に遷移しているか
          subject
          expect(response).to redirect_to(group_messages_path(group))
        end
      end
        # 保存に失敗している
      context 'can not save' do
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, content: nil, image: nil) } }

        subject {
          post :create,
          params: invalid_params
        }
          
        it 'does not count up' do # メッセージの保存は行われなかったか
          expect{ subject }.not_to change(Message, :count)
        end
          
        it 'renders index' do # 意図したビューが描画されているか
          subject
          expect(response).to render_template :index
        end
      end
    end
      # ログインしていない
    context 'not log in' do
        
      it 'redirects to new_user_session_path' do  # 意図した画面にリダイレクトできているか
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end