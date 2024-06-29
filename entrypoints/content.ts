import './styles.css';
import ReactDOM from 'react-dom/client';
import Sidebar from "@/components/ui/sidebar.tsx";

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'wxt-react-example',
      position: 'inline',
      anchor: 'body',
      append: 'first',
      onMount: (container) => {
				const app = document.createElement('div');
				container.append(app);
				const root = ReactDOM.createRoot(app);
				root.render(Sidebar())
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });
    ui.mount();
  },
});