class MVCStructure:
    def __init__(self, models=None, views=None, controllers=None):
        self.models = models or {}
        self.views = views or {}
        self.controllers = controllers or {}

    def to_dict(self):
        return {
            'models': self.models,
            'views': self.views,
            'controllers': self.controllers
        }